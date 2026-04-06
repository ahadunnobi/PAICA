# PAICA Future Plan: Mobile-First & On-Device AI

This document outlines the pivot towards a mobile-first, privacy-centric Personal AI Communication Agent.

## 📱 Mobile Application (Priority 1)
- **Framework**: React Native (Expo) for cross-platform iOS and Android support.
- **Core Feature**: Unified inbox for Telegram, WhatsApp, and SMS with AI assistance.
- **Status**: [/] In Progress (Initialization)

## 🧠 On-Device Intelligence (Priority 1)
- **Model**: **Gemma 2B** (Google) optimized for mobile.
- **Inference Engine**: **MediaPipe LLM Inference API** (Core ML / NNAPI).
- **Privacy**: 100% offline processing. No cloud telemetry for message content.
- **Capabilities**:
    - Intent detection (Urgent, Casual, Business).
    - Contextual reply drafting.
    - Relationship strength analysis.
- **Status**: [ ] Researching Integration

## 🛠️ Upcoming Integrations
- **Platform Connectors**: Official WhatsApp Business API, Telegram MTProto.
- **Personality Engine**: Local fine-tuning or few-shot prompting using the user's historical message style.
- **Voice-to-Voice**: On-device Whisper for transcription and TTS for "Voice Assistant" mode.

---
*Note: This plan reflects the pivot from the legacy web/backend architecture to a mobile-first product.*
