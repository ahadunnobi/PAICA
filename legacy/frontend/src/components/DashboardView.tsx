"use client";

import React from 'react';
import { MessageSquare, CheckCircle, BarChart2, Bell } from 'lucide-react';
import MessageCard from './MessageCard';

export default function DashboardView() {
  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Intelligence Hub</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>
            Managing 4 platforms in your personal style.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass" style={{ padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
            <Bell size={18} />
          </div>
          <div className="glass" style={{ padding: '10px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>AI Online</span>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Unread Messages', value: '12', color: '#6366f1', delta: '+3 today' },
          { label: 'Pending Approvals', value: '4',  color: '#f59e0b', delta: 'Action needed' },
          { label: 'Sent This Week',   value: '87', color: '#10b981', delta: '+12 vs last wk' },
          { label: 'Avg Response Time',value: '2m',  color: '#8b5cf6', delta: 'Lightning fast' },
        ].map((s) => (
          <div key={s.label} className="card-glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Latest Messages */}
        <section>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#6366f1" /> Latest Messages
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MessageCard sender="John Doe"       platform="Telegram"  content="Hey! Are we still on for the meeting tomorrow?" intent="Business" time="2m ago"  />
            <MessageCard sender="+1 234 567 890" platform="WhatsApp"  content="Just saw your post, really cool stuff man."        intent="Casual"   time="15m ago" />
            <MessageCard sender="Sarah Smith"    platform="Instagram" content="Loved the collaboration! When can we do it again?" intent="Casual"   time="1h ago"  />
          </div>
        </section>

        {/* Right column */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Approval Queue */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} color="#8b5cf6" /> Approval Queue
            </h2>
            <div className="card-glass" style={{ padding: '20px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Draft for John Doe</p>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
                "Hey John! Yes, absolutely. See you there at 10 AM. Looking forward to it!"
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="primary-button" id="approve-reply-btn" style={{ flex: 1, fontSize: '13px', padding: '9px 14px' }}>Approve & Send</button>
                <button className="glass" id="edit-reply-btn" style={{ padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', border: 'none', color: 'white' }}>Edit</button>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#10b981" /> Tone Mode
            </h2>
            <div className="card-glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Professional', 'Friendly', 'Flirty'].map((mode) => (
                  <label key={mode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', userSelect: 'none' }}>
                    <span style={{ fontSize: '14px' }}>{mode}</span>
                    <input type="radio" name="tone-mode" id={`mode-${mode.toLowerCase()}`} defaultChecked={mode === 'Professional'} style={{ accentColor: '#6366f1' }} />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
