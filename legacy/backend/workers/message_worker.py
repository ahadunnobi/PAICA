import asyncio
import redis.asyncio as redis
import json
from loguru import logger
from ..config import settings
from ..db.database import SessionLocal
from ..db.models import Message, Conversation, Contact, User, PersonalityProfile, AIReply, RelationshipType, IntentType
from ..services.context_classifier import context_classifier
from ..services.personality_engine import personality_engine
from ..services.safety_filter import safety_filter
from ..services.billing_service import BillingService
from sqlalchemy import select

class MessageWorker:
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL)

    async def start(self):
        logger.info("Message worker started...")
        while True:
            # Pop from the 'incoming_messages' queue
            _, job_data = await self.redis.blpop("incoming_messages")
            if job_data:
                await self.process_message(json.loads(job_data))

    async def process_message(self, data):
        """
        Flow: Ingest -> Classify -> Generate Reply -> Store/Send
        """
        async with SessionLocal() as db:
            platform = data["platform"]
            platform_id = data["platform_id"]
            content = data["content"]
            sender_name = data.get("sender_name", "Unknown")

            # 1. Resolve Contact & Conversation
            # (Simplified: assumes user 1 for now)
            result = await db.execute(select(Contact).where(Contact.platform_id == platform_id, Contact.platform == platform))
            contact = result.scalar_one_or_none()
            
            if not contact:
                contact = Contact(user_id=1, platform_id=platform_id, platform=platform, name=sender_name)
                db.add(contact)
                await db.commit()
                await db.refresh(contact)

            result = await db.execute(select(Conversation).where(Conversation.contact_id == contact.id))
            conversation = result.scalar_one_or_none()
            if not conversation:
                conversation = Conversation(user_id=1, contact_id=contact.id)
                db.add(conversation)
                await db.commit()
                await db.refresh(conversation)

            # 2. Store Incoming Message
            msg = Message(
                conversation_id=conversation.id,
                sender_id=platform_id,
                content=content,
                is_incoming=True,
                platform_message_id=data.get("message_id")
            )
            db.add(msg)
            await db.flush()

            # 3. Classify Context
            classification = await context_classifier.classify_message(content, sender_name)
            msg.intent = IntentType(classification.get("intent", "unknown"))
            contact.relationship = RelationshipType(classification.get("relationship", "unknown"))

            # 4. Apply Personality & Generate Reply
            # Use default profile
            if profile:
                # 4.1 Check Billing/Usage
                can_gen, reason = await BillingService.can_generate_reply(db, 1) # Assuming user 1 for MVP
                if not can_gen:
                    logger.warning(f"Billing limit reached for user 1: {reason}")
                    # Optionally store a system message or notify user
                    await db.commit()
                    return

                suggested_reply = await personality_engine.apply_personality(
                    content, profile, sender_name, classification.get("summary", "")
                )
                
                # 5. Safety Filter
                is_safe, reason = await safety_filter.check_content(suggested_reply)
                
                # 6. Store AI Reply Draft
                reply_draft = AIReply(
                    message_id=msg.id,
                    suggested_content=suggested_reply,
                    personality_profile_id=profile.id,
                    status="pending" if not is_safe or safety_filter.is_escalation_required(msg.intent, contact.relationship) else "pending"
                )
                db.add(reply_draft)
                await db.flush()

                # 7. Increment Usage
                await BillingService.increment_usage(db, 1) # Assuming user 1

            await db.commit()
            logger.success(f"Processed message from {sender_name}")

if __name__ == "__main__":
    worker = MessageWorker()
    asyncio.run(worker.start())
