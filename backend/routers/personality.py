from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..db.database import get_db
from ..db.models import PersonalityProfile
from ..services.personality_engine import personality_engine
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class ProfileSchema(BaseModel):
    id: int
    name: str
    tone_rules: dict
    sample_messages: List[str]
    is_default: bool

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ProfileSchema])
async def get_profiles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PersonalityProfile))
    return result.scalars().all()

@router.post("/")
async def create_profile(profile_data: ProfileSchema, db: AsyncSession = Depends(get_db)):
    profile = PersonalityProfile(
        user_id=1, # Hardcoded for MVP
        name=profile_data.name,
        tone_rules=profile_data.tone_rules,
        sample_messages=profile_data.sample_messages,
        is_default=profile_data.is_default
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile

class AnalyzeRequest(BaseModel):
    text: str

class InterviewRequest(BaseModel):
    chat_history: List[Dict]

@router.post("/train/analyze")
async def analyze_style(data: AnalyzeRequest):
    return await personality_engine.analyze_style_from_text(data.text)

@router.post("/train/interview")
async def conduct_interview(data: InterviewRequest):
    next_action = await personality_engine.generate_interview_interaction(data.chat_history)
    return {"content": next_action}
