"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { MessageSquare, CheckCircle, Settings, BarChart2, Bell } from 'lucide-react';
import MessageCard from '@/components/MessageCard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <main style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="content-area" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '700' }}>
              Intelligence Hub
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              Managing 4 platforms in your personal style.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
             <div className="glass" style={{ padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
               <Bell size={20} />
             </div>
             <div className="glass" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
               <span style={{ fontSize: '14px', fontWeight: '600' }}>AI Online</span>
             </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          
          {/* Main Feed */}
          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={20} color="#6366f1" />
              Latest Messages
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MessageCard 
                sender="John Doe" 
                platform="Telegram" 
                content="Hey! Are we still on for the meeting tomorrow?"
                intent="Business"
                time="2m ago"
              />
              <MessageCard 
                sender="+1 234 567 890" 
                platform="WhatsApp" 
                content="Just saw your post, really cool stuff man."
                intent="Casual"
                time="15m ago"
              />
              <MessageCard 
                sender="Sarah Smith" 
                platform="Instagram" 
                content="Loved the collaboration! When can we do it again?"
                intent="Casual"
                time="1h ago"
              />
            </div>
          </section>

          {/* Quick Actions / Approval Queue */}
          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="#8b5cf6" />
              Approval Queue
            </h2>
            
            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Draft Reply for John
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  "Hey John! Yes, absolutely. See you there at 10 AM. Looking forward to it!"
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="primary-button" style={{ flex: 1 }}>Approve & Send</button>
                <button className="glass" style={{ padding: '10px', borderRadius: '12px' }}>Edit</button>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '24px', marginTop: '20px' }}>
               <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Mode Switcher</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Professional', 'Friendly', 'Flirty'].map((mode) => (
                    <div key={mode} className="glass" style={{ padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>{mode}</span>
                      <input type="radio" name="mode" defaultChecked={mode === 'Professional'} />
                    </div>
                  ))}
               </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
