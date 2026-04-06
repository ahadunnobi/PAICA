from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List
from ..db.database import get_db
from ..db.models import AIReply, Message, Contact
from ..services.platform_connectors.telegram import telegram_connector
from ..services.platform_connectors.email_connector import email_connector
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ReplyApprovalSchema(BaseModel):
    id: int
    suggested_content: str
    status: str

@router.get("/pending", response_model=List[ReplyApprovalSchema])
async def get_pending_replies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AIReply).where(AIReply.status == "pending")
    )
    return result.scalars().all()

@router.post("/{reply_id}/approve")
async def approve_reply(reply_id: int, db: AsyncSession = Depends(get_db)):
    # 1. Fetch the reply and its message/contact context
    result = await db.execute(
        select(AIReply, Message, Contact)
        .join(Message, AIReply.message_id == Message.id)
        .join(Contact, Message.sender_id == Contact.platform_id)
        .where(AIReply.id == reply_id)
    )
    reply, message, contact = result.one_or_none() or (None, None, None)
    
    if not reply:
        raise HTTPException(status_code=404, detail="Reply not found")

    # 2. Trigger Platform Send
    success = False
    if contact.platform == "telegram":
        success = await telegram_connector.send_message(contact.platform_id, reply.suggested_content)
    elif contact.platform == "email":
        success = await email_connector.send_email(contact.platform_id, "RE: Personal AI Agent", reply.suggested_content)
    # Add other platforms...

    if success:
        reply.status = "sent"
        reply.sent_at = datetime.utcnow()
        await db.commit()
        return {"status": "success", "message": "Reply sent via " + contact.platform}
    else:
        raise HTTPException(status_code=500, detail="Failed to send reply via platform API")

@router.post("/{reply_id}/reject")
async def reject_reply(reply_id: int, db: AsyncSession = Depends(get_db)):
    await db.execute(
        update(AIReply).where(AIReply.id == reply_id).values(status="rejected")
    )
    await db.commit()
    return {"status": "rejected"}
