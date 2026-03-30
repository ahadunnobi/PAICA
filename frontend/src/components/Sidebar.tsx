import React from 'react';
import { Home, MessageSquare, CheckCircle, Settings, BarChart2, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'inbox', icon: Home, label: 'Dashboard' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'approvals', icon: CheckCircle, label: 'Approvals' },
    { id: 'personality', icon: Settings, label: 'Personality' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'safety', icon: ShieldAlert, label: 'Safety' },
  ];

  return (
    <div className="glass" style={{ width: '280px', height: '100%', display: 'flex', flexDirection: 'column', padding: '30px 20px' }}>
      <div style={{ marginBottom: '40px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px' }}></div>
        <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>PAICA</span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={isActive ? "glass" : ""}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)'
              }}
            >
              <Icon size={20} color={isActive ? '#6366f1' : '#666'} />
              <span style={{ fontSize: '15px', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Pro Account</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>2,450 / 5,000 messages remaining this month.</p>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{ width: '49%', height: '100%', background: 'var(--primary)' }}></div>
        </div>
      </div>
    </div>
  );
}
