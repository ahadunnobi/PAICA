from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class RelationshipType(str, enum.Enum):
    friend = "friend"
    client = "client"
    romantic = "romantic"
    family = "family"
    unknown = "unknown"

class IntentType(str, enum.Enum):
    business = "business"
    casual = "casual"
    flirting = "flirting"
    urgent = "urgent"
    conflict = "conflict"
    unknown = "unknown"

class ReplyStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    sent = "sent"

class PlatformType(str, enum.Enum):
    whatsapp = "whatsapp"
    telegram = "telegram"
    instagram = "instagram"
    email = "email"

class SubscriptionStatus(str, enum.Enum):
    trialing = "trialing"
    active = "active"
    past_due = "past_due"
    canceled = "canceled"
    unpaid = "unpaid"

class PlanTier(str, enum.Enum):
    free = "free"
    pro = "pro"
    elite = "elite"

class PlatformConnection(Base):
    __tablename__ = "platform_connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(Enum(PlatformType), nullable=False)
    credentials = Column(JSON, nullable=False) # Store encrypted tokens/keys
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="platform_connections")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    contacts = relationship("Contact", back_populates="user")
    personality_profiles = relationship("PersonalityProfile", back_populates="user")
    platform_connections = relationship("PlatformConnection", back_populates="user")
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    usage_stats = relationship("UsageStats", back_populates="user")
    orders = relationship("Order", back_populates="user")

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform_id = Column(String)
    platform = Column(String)
    name = Column(String)
    relationship = Column(Enum(RelationshipType), default=RelationshipType.unknown)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="contacts")
    conversations = relationship("Conversation", back_populates="contact")

class PersonalityProfile(Base):
    __tablename__ = "personality_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    tone_rules = Column(JSON)
    sample_messages = Column(JSON) # Stored as list of strings
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="personality_profiles")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    last_message_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    contact = relationship("Contact", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(String)
    content = Column(Text)
    intent = Column(Enum(IntentType), default=IntentType.unknown)
    is_incoming = Column(Boolean, nullable=False)
    platform_message_id = Column(String)
    metadata_json = Column(JSON, name="metadata")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
    replies = relationship("AIReply", back_populates="message")

class AIReply(Base):
    __tablename__ = "ai_replies"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey("messages.id"))
    suggested_content = Column(Text)
    personality_profile_id = Column(Integer, ForeignKey("personality_profiles.id"))
    status = Column(Enum(ReplyStatus), default=ReplyStatus.pending)
    approved_by_user = Column(Boolean, default=False)
    sent_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    message = relationship("Message", back_populates="replies")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stripe_customer_id = Column(String, unique=True, index=True)
    stripe_subscription_id = Column(String, unique=True, index=True)
    plan_tier = Column(Enum(PlanTier), default=PlanTier.free)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.active)
    current_period_end = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="subscription")

class UsageStats(Base):
    __tablename__ = "usage_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month_year = Column(String, index=True) # Format: YYYY-MM
    ai_replies_count = Column(Integer, default=0)
    extra_credits = Column(Integer, default=0) # Manually purchased top-up credits
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="usage_stats")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stripe_checkout_id = Column(String, unique=True)
    amount = Column(Integer) # In cents
    currency = Column(String, default="usd")
    status = Column(String) # complete, expired, open
    items = Column(JSON) # Detailed description of what was bought
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")
