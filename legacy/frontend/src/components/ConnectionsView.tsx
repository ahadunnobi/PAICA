"use client";

import React, { useState } from 'react';
import {
  MessageSquare, Mail, Instagram, Phone, Plug, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Eye, EyeOff, Save, Trash2
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[];
}

const PLATFORMS: Platform[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#0088cc',
    icon: <MessageSquare size={22} />,
    description: 'Connect via your Telegram Bot Token from @BotFather.',
    fields: [
      { key: 'bot_token', label: 'Bot Token', placeholder: '123456:ABC-DEF1234...', secret: true },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    color: '#25D366',
    icon: <Phone size={22} />,
    description: 'Connect via Meta Cloud API Access Token.',
    fields: [
      { key: 'access_token',     label: 'Access Token',      placeholder: 'EAAxxxxxxxxxxxxxxx', secret: true },
      { key: 'phone_number_id',  label: 'Phone Number ID',   placeholder: '10000000000000' },
      { key: 'verify_token',     label: 'Webhook Verify Token', placeholder: 'my_secret_verify_token', secret: true },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#e1306c',
    icon: <Instagram size={22} />,
    description: 'Connect via Meta Graph API. Requires a Business account.',
    fields: [
      { key: 'access_token',  label: 'Access Token',    placeholder: 'EAAxxxxxxxxxxxxxxx', secret: true },
      { key: 'verify_token',  label: 'Verify Token',    placeholder: 'my_verify_token', secret: true },
    ],
  },
  {
    id: 'email',
    name: 'Email (Gmail / IMAP)',
    color: '#ea4335',
    icon: <Mail size={22} />,
    description: 'Connect your Gmail or any IMAP-compatible email address.',
    fields: [
      { key: 'email_address', label: 'Email Address',  placeholder: 'you@gmail.com' },
      { key: 'email_password',label: 'App Password',   placeholder: 'xxxx xxxx xxxx xxxx', secret: true },
      { key: 'imap_host',     label: 'IMAP Host',      placeholder: 'imap.gmail.com' },
      { key: 'smtp_host',     label: 'SMTP Host',      placeholder: 'smtp.gmail.com' },
    ],
  },
];

type FormValues = Record<string, string>;

function PlatformCard({ platform }: { platform: Platform }) {
  const [expanded, setExpanded] = useState(false);
  const [connected, setConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<FormValues>(() =>
    Object.fromEntries(platform.fields.map((f) => [f.key, '']))
  );

  const toggleSecret = (key: string) =>
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate API call
    setConnected(true);
    setExpanded(false);
    setSaving(false);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setValues(Object.fromEntries(platform.fields.map((f) => [f.key, ''])));
  };

  return (
    <div
      className="card-glass"
      style={{ padding: '0', overflow: 'hidden', border: connected ? `1px solid ${platform.color}40` : undefined }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 24px',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((e) => !e)}
        id={`platform-card-${platform.id}`}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `${platform.color}20`,
            border: `1px solid ${platform.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: platform.color,
            flexShrink: 0,
          }}
        >
          {platform.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>{platform.name}</span>
            {connected ? (
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '3px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={10} /> Connected
              </span>
            ) : (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={10} /> Not connected
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{platform.description}</p>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded Form */}
      {expanded && (
        <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gap: '14px', marginTop: '20px' }}>
            {platform.fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={`${platform.id}-${field.key}`}
                  style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id={`${platform.id}-${field.key}`}
                    type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={values[field.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  {field.secret && (
                    <button
                      type="button"
                      onClick={() => toggleSecret(field.key)}
                      id={`toggle-${platform.id}-${field.key}`}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0 }}
                    >
                      {showSecrets[field.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              id={`save-${platform.id}-btn`}
              className="primary-button"
              onClick={handleSave}
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}
            >
              <Save size={14} />
              {saving ? 'Saving…' : 'Save & Connect'}
            </button>
            {connected && (
              <button
                id={`disconnect-${platform.id}-btn`}
                onClick={handleDisconnect}
                style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}
              >
                <Trash2 size={14} /> Disconnect
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConnectionsView() {
  return (
    <>
      <header style={{ marginBottom: '36px' }}>
        <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Platform Connections</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>
          Connect your messaging platforms so PAICA can read and send messages on your behalf.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '720px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '8px' }}>
          <Plug size={14} color="#6366f1" />
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Your credentials are stored securely in the database and never exposed in the UI.
          </p>
        </div>
        {PLATFORMS.map((p) => (
          <PlatformCard key={p.id} platform={p} />
        ))}
      </div>
    </>
  );
}
