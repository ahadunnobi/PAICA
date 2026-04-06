from .ai_engine import ai_engine
import json
from loguru import logger

class ContextClassifier:
    async def classify_message(self, message_content: str, contact_name: str, history: str = ""):
        system_prompt = """
        You are a message analysis engine. Your job is to classify the intent and relationship of a message incoming to a personal user.
        
        Analyze the message and return a JSON object with:
        - "relationship": one of ["friend", "client", "romantic", "family", "unknown"]
        - "intent": one of ["business", "casual", "flirting", "urgent", "conflict", "unknown"]
        - "summary": a brief summary of what the sender wants.

        History context if available:
        {history}
        """
        
        user_prompt = f"From: {contact_name}\nMessage: {message_content}"
        
        raw_response = await ai_engine.generate_response(system_prompt, user_prompt, temperature=0.3)
        
        try:
            # Basic cleanup of AI response if it contains markdown code blocks
            clean_response = raw_response.strip("`").replace("json\n", "")
            return json.loads(clean_response)
        except Exception as e:
            logger.error(f"Failed to parse classification: {e}. Raw: {raw_response}")
            return {
                "relationship": "unknown",
                "intent": "unknown",
                "summary": "Failed to classify"
            }

context_classifier = ContextClassifier()
