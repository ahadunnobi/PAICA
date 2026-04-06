from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.database import get_db
from ..config import settings
from loguru import logger

router = APIRouter()

@router.post("/telegram")
async def telegram_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    logger.info(f"Telegram webhook received: {data}")
    # TODO: Push to Redis queue for worker processing
    return {"status": "ok"}

@router.get("/whatsapp")
async def whatsapp_verify(request: Request):
    # WhatsApp webhook verification
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    
    if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
        return int(challenge)
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    data = await request.json()
    logger.info(f"WhatsApp webhook received: {data}")
    # TODO: Push to Redis queue
    return {"status": "ok"}

@router.post("/instagram")
async def instagram_webhook(request: Request):
    data = await request.json()
    logger.info(f"Instagram webhook received: {data}")
    return {"status": "ok"}
