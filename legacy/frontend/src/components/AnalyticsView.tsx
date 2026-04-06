"use client";

import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, MessageSquare, Send, Clock } from 'lucide-react';

const PLATFORM_STATS = [
  { name: 'Telegram',  color: '#0088cc', sent: 34, received: 45, avgTime: '1.2m' },
  { name: 'WhatsApp',  color: '#25D366', sent: 28, received: 31, avgTime: '2.5m' },
  { name: 'Instagram', color: '#e1306c', sent: 15, received: 22, avgTime: '4.1m' },
  { name: 'Email',     color: '#ea4335', sent: 10, received: 18, avgTime: '12m'  },
];

const WEEKLY_DATA = [42, 58, 35, 72, 51, 89, 64];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AnalyticsView() {
  const maxVal = Math.max(...WEEKLY_DATA);

  return (
    <>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Analytics</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Your communication performance this week.</p>
      </header>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Messages Handled', value: '411', trend: '+18%', up: true, icon: <MessageSquare size={16} color="#6366f1" /> },
          { label: 'Replies Sent by AI',      value: '87',  trend: '+12%', up: true, icon: <Send size={16} color="#10b981" /> },
          { label: 'Avg Response Time',       value: '2.4m',trend: '-8%',  up: true, icon: <Clock size={16} color="#f59e0b" /> },
        ].map((k) => (
          <div key={k.label} className="card-glass" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{k.label}</p>
              {k.icon}
            </div>
            <p style={{ fontSize: '32px', fontWeight: '800' }}>{k.value}</p>
            <p style={{ fontSize: '12px', marginTop: '4px', color: k.up ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.trend} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="card-glass" style={{ padding: '28px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '24px', color: 'rgba(255,255,255,0.7)' }}>Daily Message Volume</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px' }}>
          {WEEKLY_DATA.map((val, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{val}</span>
              <div
                style={{
                  width: '100%',
                  height: `${(val / maxVal) * 100}%`,
                  background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.6s ease',
                  boxShadow: '0 0 12px rgba(99,102,241,0.3)',
                  minHeight: '6px',
                }}
              />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>Platform Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PLATFORM_STATS.map((p) => {
            const total = p.sent + p.received;
            const maxTotal = Math.max(...PLATFORM_STATS.map((x) => x.sent + x.received));
            return (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{p.name}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{total} msgs · avg {p.avgTime}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(total / maxTotal) * 100}%`, height: '100%', background: p.color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
