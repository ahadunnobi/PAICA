"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';

export default function PersonalityPage() {
  const [activeTab, setActiveTab] = useState('personality');
  const [profiles, setProfiles] = useState([
    { id: 1, name: 'Professional', tone: 'Helpful, concise, serious', samplesCount: 15, isDefault: true },
    { id: 2, name: 'Friendly', tone: 'Warm, empathetic, casual', samplesCount: 42, isDefault: false },
    { id: 3, name: 'Flirty', tone: 'Playful, charming, witty', samplesCount: 8, isDefault: false },
  ]);

  return (
    <main style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="content-area" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '700' }}>
            Personality Engine
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            Train PAICA to speak exactly like you do across different contexts.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px' }}>
          
          {/* Profiles Management */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Tone Profiles</h2>
              <button className="primary-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                <Plus size={18} />
                New Profile
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profiles.map((profile) => (
                <div key={profile.id} className="card-glass" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '600' }}>{profile.name}</span>
                      {profile.isDefault && (
                        <span style={{ fontSize: '10px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase' }}>
                          Default
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{profile.tone}</p>
                    <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>{profile.samplesCount} Training Samples</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="glass" style={{ padding: '10px', borderRadius: '10px' }}><Edit3 size={18} /></button>
                    <button className="glass" style={{ padding: '10px', borderRadius: '10px' }}><Trash2 size={18} color="#ef4444" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Training Side Panel */}
          <aside className="glass" style={{ borderRadius: '24px', padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Quick Training</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', lineHeight: '1.5' }}>
              Paste a few of your own past messages here for PAICA to analyze your tone.
            </p>
            
            <textarea 
               style={{ 
                 width: '100%', 
                 height: '150px', 
                 background: 'rgba(0,0,0,0.2)', 
                 border: '1px solid var(--glass-border)', 
                 borderRadius: '12px', 
                 padding: '12px',
                 color: 'white',
                 fontSize: '14px',
                 fontFamily: 'inherit',
                 marginBottom: '16px',
                 resize: 'none'
               }}
               placeholder="Example: Hey, how are you? Let's catch up soon!"
            />
            
            <button className="primary-button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={18} />
              Analyze & Train
            </button>
          </aside>

        </div>
      </div>
    </main>
  );
}
