from telegram import Bot
from ...config import settings
from loguru import logger

class TelegramConnector:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)

    async def send_message(self, chat_id: str, text: str):
        try:
            await self.bot.send_message(chat_id=chat_id, text=text)
            return True
        except Exception as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return False

telegram_connector = TelegramConnector()
