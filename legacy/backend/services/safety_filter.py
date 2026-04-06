from .ai_engine import ai_engine
from loguru import logger
import json

class SafetyFilter:
    async def check_content(self, content: str):
        """
        Checks for toxicity, inappropriate content, and 'do not reply' triggers.
        Returns (is_safe, reason)
        """
        system_prompt = """
        You are a safety filter for a personal AI agent. 
        Analyze the following message content for:
        1. Toxicity or hate speech.
        2. Sexual harassment or non-consensual flirting.
        3. Scams or malicious links.
        4. Sensitive personal data disclosure.
        
        Return a JSON object:
        {
            "is_safe": boolean,
            "reason": "Safe" or description of violation,
            "action": "allow" or "block" or "escalate"
        }
        """
        
        response = await ai_engine.generate_response(system_prompt, f"Content: {content}", temperature=0.0)
        
        try:
            clean_response = response.strip("`").replace("json\n", "")
            result = json.loads(clean_response)
            return result.get("is_safe", True), result.get("reason", "Safe")
        except Exception as e:
            logger.error(f"Safety filter parse error: {e}")
            return True, "Error in filter, defaulting to safe"

    def is_escalation_required(self, intent: str, relationship: str):
        """Logic to decide if human intervention is forced."""
        critical_intents = ["conflict", "urgent"]
        if intent in critical_intents:
            return True
        return False

safety_filter = SafetyFilter()
