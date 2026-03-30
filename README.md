# PAICA — Personal AI Communication Agent

A production-ready system to manage, classify, and reply to messages across multiple platforms in your personal style.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Docker & Docker Compose**
- **Python 3.11+** (for manual backend runs)
- **Node.js 18+** (for manual frontend runs)
- **OpenAI API Key**

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your API keys (Telegram, WhatsApp, OpenAI).

### 3. Launch with Docker
```bash
docker-compose up --build
```
This will start:
- **PostgreSQL**: Database for users, messages, and profiles.
- **Redis**: Queue for message ingestion.
- **FastAPI Backend**: Core intelligence and API.
- **Worker**: Background processor for AI generation.
- **Next.js Frontend**: Management dashboard at `localhost:3000`.

---

## 🧠 System Flow
1. **Ingest**: Message arrives via webhook (Telegram/WhatsApp/Instagram) or IMAP (Email).
2. **Queue**: Message is pushed to Redis `incoming_messages`.
3. **Classify**: Worker pulls message, calls LLM to detect **Relationship** and **Intent**.
4. **Style**: AI uses the user's **Personality Profile** (trained on sample messages) to draft a reply.
5. **Safety**: Content is scanned for toxicity and "Do Not Reply" triggers.
6. **Approve**: Dashboard shows the draft; user clicks "Approve & Send".
7. **Send**: Platform Connector sends the final text back to the sender.

---

## 📈 Growth & Strategy

### Target Audience
- **Creators & Influencers**: Managing hundreds of DMs across IG/TikTok.
- **Busy Business Owners**: Triaging WhatsApp/Email during meetings.
- **Dating App Power-Users**: (Ethical usage encouraged) handling multiple chats.

### Funnel Strategy
1. **Content**: Short-form videos (Reels/TikTok) showing the "Unified Inbox" vs. 5 different apps.
2. **Lead Magnet**: Free "Tone Analysis" tool on the landing page.
3. **Demo**: Interactive dashboard walkthrough showing AI intent detection.
4. **Signup**: Free tier with 50 messages/month to build hook.

### Sample Ad Copy
> "Stop drowning in DMs. PAICA connects to your WhatsApp, Telegram, and Email to reply in *your* voice while you sleep. Human approval mode included. Try the AI that sounds like YOU."

---

## 💰 Monetization

| Tier | Price | Features |
|------|-------|---------|
| **Free** | $0 | 1 platform, 50 msgs, manual approval only |
| **Pro** | $29/mo | All platforms, 2000 msgs, Personality Engine, Memory |
| **Business** | $79/mo | Unlimited, Auto-reply, Multi-user, Analytics |

---

## ⚠️ Risks & Ethics
- **Platform Bans**: Always use official Business APIs (Meta Graph API). Never use "scrapers" or unofficial libraries like `whatsapp-web.js` for production.
- **Deception**: We recommend adding a small tag like "⚡ Sent via AI Assistant" to stay ethical and comply with EU AI regulations.
- **Privacy**: Message data is sensitive. Use encrypted DB fields and never train global models on private user data.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (TypeScript, Glassmorphism CSS)
- **Backend**: FastAPI (Python)
- **Intelligence**: OpenAI GPT-4o / Context Engines
- **Database**: PostgreSQL (SQLAlchemy) + Redis (RQ)
- **Deployment**: Docker Compose
