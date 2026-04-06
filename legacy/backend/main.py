from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import webhook, messages, replies, personality, connections, billing

app = FastAPI(title="Personal AI Communication Agent API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(webhook.router, prefix="/webhook", tags=["Webhooks"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(replies.router, prefix="/api/replies", tags=["Replies"])
app.include_router(personality.router, prefix="/api/personality", tags=["Personality"])
app.include_router(connections.router, prefix="/api/connections", tags=["Connections"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])

@app.get("/")
async def root():
    return {"message": "Personal AI Communication Agent API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
