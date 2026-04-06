-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── Contacts ──────────────────────────────────────────────
CREATE TYPE relationship_type AS ENUM ('friend', 'client', 'romantic', 'family', 'unknown');

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    platform_id VARCHAR(255), -- ID on the platform (e.g., Telegram chat ID, Phone number)
    platform VARCHAR(50), -- 'whatsapp', 'telegram', 'instagram', 'email'
    name VARCHAR(255),
    relationship relationship_type DEFAULT 'unknown',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform_id, platform)
);

-- ─── Personality Profiles ──────────────────────────────────
CREATE TABLE IF NOT EXISTS personality_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'Professional', 'Friendly', 'Flirty'
    tone_rules JSONB, -- Example: {"short": true, "humorous": 0.5, "formality": 0.8}
    sample_messages TEXT[],
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── Conversations ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── Messages ──────────────────────────────────────────────
CREATE TYPE intent_type AS ENUM ('business', 'casual', 'flirting', 'urgent', 'conflict', 'unknown');

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(255), -- platform_id of the sender
    content TEXT,
    intent intent_type DEFAULT 'unknown',
    is_incoming BOOLEAN NOT NULL,
    platform_message_id VARCHAR(255),
    metadata JSONB, -- Platform specific metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── AI Replies (Drafts) ───────────────────────────────────
CREATE TYPE reply_status AS ENUM ('pending', 'approved', 'rejected', 'sent');

CREATE TABLE IF NOT EXISTS ai_replies (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    suggested_content TEXT,
    personality_profile_id INTEGER REFERENCES personality_profiles(id),
    status reply_status DEFAULT 'pending',
    approved_by_user BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── System Logs ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    level VARCHAR(50),
    event VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
