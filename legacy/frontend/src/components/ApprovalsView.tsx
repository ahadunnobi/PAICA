"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit3, Send, MessageSquare, Clock } from 'lucide-react';

interface ApprovalItem {
  id: number;
  forName: string;
  platform: string;
  original: string;
  draft: string;
  time: string;
}

const MOCK_APPROVALS: ApprovalItem[] = [
  { id: 1, forName: 'John Doe',    platform: 'Telegram',  original: 'Hey! Are we still on for the meeting tomorrow?',  draft: 'Hey John! Yes, absolutely. See you there at 10 AM. Looking forward to it!', time: '2m ago'  },
  { id: 2, forName: 'Sarah Smith', platform: 'Instagram', original: 'Loved the collaboration! When can we do it again?', draft: 'Had such a great time too! Let\'s reconnect next month, I\'ll DM you some dates 🙌', time: '1h ago'  },
  { id: 3, forName: 'boss@work',   platform: 'Email',     original: 'Please send over the Q2 report by Friday.',         draft: 'Hi, noted! The Q2 report will be in your inbox by Thursday EOD. Thanks.', time: '3h ago'  },
];

function ApprovalCard({ item }: { item: ApprovalItem }) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.draft);

  if (status === 'approved') {
    return (
      <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
        <CheckCircle size={18} color="#10b981" />
        <span style={{ fontSize: '13px', color: '#10b981' }}>Sent to {item.forName} via {item.platform}</span>
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
        <XCircle size={18} color="#ef4444" />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Discarded reply for {item.forName}</span>
      </div>
    );
  }

  return (
    <div className="card-glass" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.forName}</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginLeft: '10px' }}>via {item.platform}</span>
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={11} /> {item.time}
        </span>
      </div>

      {/* Original */}
      <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Their message</p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{item.original}</p>
      </div>

      {/* AI Draft */}
      <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <p style={{ fontSize: '11px', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Draft</p>
          <button id={`edit-btn-${item.id}`} onClick={() => setEditing((e) => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <Edit3 size={11} /> {editing ? 'Done' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <textarea
            id={`draft-textarea-${item.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontSize: '13px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: '1.6' }}
          />
        ) : (
          <p style={{ fontSize: '13px', lineHeight: '1.6' }}>{draft}</p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          id={`approve-btn-${item.id}`}
          className="primary-button"
          onClick={() => setStatus('approved')}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
        >
          <Send size={14} /> Approve & Send
        </button>
        <button
          id={`reject-btn-${item.id}`}
          onClick={() => setStatus('rejected')}
          style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <XCircle size={14} /> Reject
        </button>
      </div>
    </div>
  );
}

export default function ApprovalsView() {
  const pendingCount = MOCK_APPROVALS.length;

  return (
    <>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Approval Queue</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>
          Review AI-generated replies before they're sent. {pendingCount} pending.
        </p>
      </header>

      {MOCK_APPROVALS.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>All caught up!</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>No pending approvals right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
          {MOCK_APPROVALS.map((item) => <ApprovalCard key={item.id} item={item} />)}
        </div>
      )}
    </>
  );
}
