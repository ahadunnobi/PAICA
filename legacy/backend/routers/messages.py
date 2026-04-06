from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..db.database import get_db
from ..db.models import Message, Conversation
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class MessageSchema(BaseModel):
    id: int
    content: str
    sender_id: str
    is_incoming: bool
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[MessageSchema])
async def get_messages(db: AsyncSession = Depends(get_db), limit: int = 50):
    result = await db.execute(select(Message).order_by(Message.created_at.desc()).limit(limit))
    return result.scalars().all()

@router.get("/conversation/{conversation_id}", response_model=List[MessageSchema])
async def get_conversation_messages(conversation_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    return result.scalars().all()
