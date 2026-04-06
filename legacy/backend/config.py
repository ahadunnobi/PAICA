import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    DATABASE_URL: str = "postgresql+asyncpg://paica:paica_pass@localhost:5432/paica_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    TELEGRAM_BOT_TOKEN: str = ""
    
    WHATSAPP_ACCESS_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_VERIFY_TOKEN: str = ""

    INSTAGRAM_ACCESS_TOKEN: str = ""
    INSTAGRAM_VERIFY_TOKEN: str = ""

    EMAIL_ADDRESS: str = ""
    EMAIL_PASSWORD: str = ""
    IMAP_HOST: str = "imap.gmail.com"
    IMAP_PORT: int = 993
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    
    # Stripe Settings
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_ID_PRO: str = "price_Hobbyist"
    STRIPE_PRICE_ID_ELITE: str = "price_Professional"
    
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
