"use client";

import React from 'react';
import { Home, MessageSquare, CheckCircle, Settings, BarChart2, ShieldAlert, Plug } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'inbox',       icon: Home,         label: 'Dashboard'   },
  { id: 'messages',   icon: MessageSquare, label: 'Messages'    },
  { id: 'approvals',  icon: CheckCircle,   label: 'Approvals'   },
  { id: 'personality',icon: Settings,      label: 'Personality' },
  { id: 'analytics',  icon: BarChart2,     label: 'Analytics'   },
  { id: 'safety',     icon: ShieldAlert,   label: 'Safety'      },
  { id: 'connections',icon: Plug,          label: 'Connections' },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="glass" style={{ width: '260px', minWidth: '260px', height: '100%', display: 'flex', flexDirection: 'column', padding: '30px 16px' }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', flexShrink: 0 }} />
        <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>PAICA</span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <Icon size={18} color={isActive ? '#6366f1' : 'rgba(255,255,255,0.35)'} />
              <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Usage card */}
      <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'rgba(255,255,255,0.9)' }}>Pro Account</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5' }}>2,450 / 5,000 messages this month</p>
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ width: '49%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  );
}
