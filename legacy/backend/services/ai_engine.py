import openai
from ..config import settings
from loguru import logger

class AIEngine:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_response(self, system_prompt: str, user_prompt: str, temperature: float = 0.7):
        try:
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling OpenAI: {e}")
            return None

ai_engine = AIEngine()
