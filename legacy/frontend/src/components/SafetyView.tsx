"use client";

import React, { useState } from 'react';
import { ShieldAlert, Shield, AlertTriangle, Ban, CheckCircle } from 'lucide-react';

const RULES = [
  { id: 'block_explicit',  label: 'Block Explicit Language',               desc: 'Prevent AI from generating or sending replies with explicit content.',          defaultOn: true  },
  { id: 'flag_urgent',     label: 'Flag Urgent Messages for Review',       desc: 'Automatically send urgent messages to the approval queue before replying.',      defaultOn: true  },
  { id: 'no_financial',    label: 'No Financial Commitments',              desc: 'Reject AI replies that contain financial promises or transaction discussions.',   defaultOn: true  },
  { id: 'no_personal_info',label: 'Protect Personal Information',          desc: 'Block replies that include your phone, address, or ID numbers.',                 defaultOn: true  },
  { id: 'conflict_pause',  label: 'Pause on Conflict Detection',           desc: 'Pause auto-reply when conflict or angry sentiment is detected in a conversation.',defaultOn: false },
  { id: 'rate_limit',      label: 'Rate Limit Outgoing Messages',          desc: 'Maximum 10 automated messages per hour across all platforms.',                   defaultOn: false },
];

export default function SafetyView() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(RULES.map((r) => [r.id, r.defaultOn]))
  );

  const toggle = (id: string) => setEnabled((e) => ({ ...e, [id]: !e[id] }));
  const activeCount = Object.values(enabled).filter(Boolean).length;

  return (
    <>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Safety & Filters</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>
          Configure guardrails that govern what the AI can and cannot do on your behalf.
        </p>
      </header>

      {/* Status banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', background: activeCount > 3 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${activeCount > 3 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, marginBottom: '24px' }}>
        <Shield size={18} color={activeCount > 3 ? '#10b981' : '#ef4444'} />
        <p style={{ fontSize: '13px', color: activeCount > 3 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
          {activeCount} of {RULES.length} safety rules are active. {activeCount < 4 && '⚠️ Consider enabling more rules for better protection.'}
        </p>
      </div>

      {/* Rules list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
        {RULES.map((rule) => (
          <div key={rule.id} className="card-glass" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', border: enabled[rule.id] ? '1px solid rgba(99,102,241,0.2)' : undefined }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {enabled[rule.id]
                  ? <CheckCircle size={17} color="#10b981" />
                  : <AlertTriangle size={17} color="rgba(255,255,255,0.25)" />}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{rule.label}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>{rule.desc}</p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              id={`toggle-rule-${rule.id}`}
              onClick={() => toggle(rule.id)}
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: enabled[rule.id] ? '#6366f1' : 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
                flexShrink: 0,
              }}
              aria-label={`Toggle ${rule.label}`}
            >
              <span style={{
                position: 'absolute',
                top: '3px',
                left: enabled[rule.id] ? '23px' : '3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.3s ease',
                display: 'block',
              }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
