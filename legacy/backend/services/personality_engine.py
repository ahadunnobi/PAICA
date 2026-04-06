from .ai_engine import ai_engine
from ..db.models import PersonalityProfile
import json
from typing import List, Dict

class PersonalityEngine:
    async def apply_personality(self, message_content: str, profile: PersonalityProfile, contact_name: str, context_summary: str):
        tone_rules = profile.tone_rules or {}
        samples = profile.sample_messages or []
        
        system_prompt = f"""
        You are an AI assistant acting on behalf of the user. Your name is the user's name.
        Target Personality: {profile.name}
        
        Tone Rules:
        {json.dumps(tone_rules, indent=2)}
        
        Example messages from the user in this style:
        {chr(10).join([f"- {s}" for s in samples])}
        
        Context of the conversation:
        {context_summary}
        
        Constraint: 
        - Do NOT impersonate deceptively. 
        - If asked if you are an AI, be honest but stay in character as an assistant.
        - Be concise and match the user's style perfectly.
        - Reply to: {contact_name}
        """
        
        user_prompt = f"Incoming message: {message_content}\n\nGenerate a perfect reply in the user's style:"
        
        reply = await ai_engine.generate_response(system_prompt, user_prompt, temperature=0.8)
        return reply

    async def analyze_style_from_text(self, text: str) -> Dict:
        system_prompt = """
        You are an expert Linguistic Analyst. Your task is to analyze the provided chat messages from a single user and extract their unique 'personality profile'.
        
        Extract the following:
        1. Tone Rules: Specific rules that govern how they speak (e.g., 'Never uses capital letters', 'Uses many emojis', 'Extremely concise', 'Formal but friendly').
        2. Sample Messages: 3-5 clean, representative examples of their messages, anonymized if necessary.
        
        Return the result ONLY as a JSON object with this structure:
        {
          "tone_rules": { "rule_name": "description", ... },
          "sample_messages": ["msg1", "msg2", ...]
        }
        """
        
        user_prompt = f"Analyze these messages and extract the personality profile:\n\n{text}"
        
        response_text = await ai_engine.generate_response(system_prompt, user_prompt, temperature=0.3)
        try:
            return json.loads(response_text)
        except:
            # Fallback to simple extraction if JSON fails
            return {"tone_rules": {"general": "Concise and friendly"}, "sample_messages": []}

    async def generate_interview_interaction(self, chat_history: List[Dict]) -> str:
        system_prompt = """
        You are a 'Personality Architect'. Your goal is to interview the user to learn their communication style.
        
        Be friendly, professional, and probing. 
        If it's the start, ask a broad question like 'How do you usually greet your friends vs. clients?'.
        If you have enough information, provide a summary of what you've learned and ask for confirmation.
        
        Keep each response short and focused on ONE aspect (greetings, emoji usage, brevity, etc.).
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        for chat in chat_history:
            role = "user" if chat["is_user"] else "assistant"
            messages.append({"role": role, "content": chat["content"]})
            
        # We use a custom call to openai here via a mock or the existing engine with more history
        # For simplicity, we just pass the last few interactions as a user prompt for now 
        # but let's assume ai_engine can handle it or we enhance it.
        # Let's improve ai_engine to handle multi-turn if needed, but for now we'll wrap it.
        
        history_str = "\n".join([f"{'User' if c['is_user'] else 'AI'}: {c['content']}" for c in chat_history])
        user_prompt = f"Current interview history:\n\n{history_str}\n\nContinue the interview or summarize:"
        
        return await ai_engine.generate_response(system_prompt, user_prompt, temperature=0.7)

personality_engine = PersonalityEngine()
