"use client";

import React from 'react';
import { MessageSquare, Search, Filter } from 'lucide-react';
import MessageCard from './MessageCard';

const ALL_MESSAGES = [
  { sender: 'John Doe',       platform: 'Telegram',  content: 'Hey! Are we still on for the meeting tomorrow?',       intent: 'Business', time: '2m ago'  },
  { sender: '+1 234 567 890', platform: 'WhatsApp',  content: 'Just saw your post, really cool stuff man.',             intent: 'Casual',   time: '15m ago' },
  { sender: 'Sarah Smith',    platform: 'Instagram', content: 'Loved the collaboration! When can we do it again?',      intent: 'Casual',   time: '1h ago'  },
  { sender: 'boss@company.io',platform: 'Email',     content: 'Please send over the Q2 report by Friday.',             intent: 'Business', time: '3h ago'  },
  { sender: 'Alex K.',        platform: 'Telegram',  content: 'Are you free this weekend? Planning a small gathering.', intent: 'Casual',   time: '5h ago'  },
  { sender: '+44 7700 900000',platform: 'WhatsApp',  content: 'This is URGENT — call me back ASAP.',                   intent: 'Urgent',   time: '6h ago'  },
];

const PLATFORMS = ['All', 'Telegram', 'WhatsApp', 'Instagram', 'Email'];

export default function MessagesView() {
  const [filter, setFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');

  const filtered = ALL_MESSAGES.filter((m) => {
    const matchesPlatform = filter === 'All' || m.platform === filter;
    const matchesSearch = m.sender.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Messages</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>All incoming messages across your connected platforms.</p>
      </header>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input
            id="message-search"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={14} color="rgba(255,255,255,0.3)" />
          {PLATFORMS.map((p) => (
            <button
              key={p}
              id={`filter-${p.toLowerCase()}`}
              onClick={() => setFilter(p)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid', borderColor: filter === p ? '#6366f1' : 'rgba(255,255,255,0.1)', background: filter === p ? 'rgba(99,102,241,0.15)' : 'transparent', color: filter === p ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
            <MessageSquare size={40} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '14px' }}>No messages match your filters.</p>
          </div>
        ) : (
          filtered.map((m, i) => <MessageCard key={i} {...m} />)
        )}
      </div>
    </>
  );
}
