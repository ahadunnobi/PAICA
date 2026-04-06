"use client";

import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit3, Brain, Wand2, Sparkles } from 'lucide-react';
import PersonalityTrainingWizard from './PersonalityTrainingWizard';

const DEFAULT_PROFILES = [
  { id: 1, name: 'Professional', tone: 'Helpful, concise, serious',  samplesCount: 15, isDefault: true  },
  { id: 2, name: 'Friendly',     tone: 'Warm, empathetic, casual',   samplesCount: 42, isDefault: false },
  { id: 3, name: 'Flirty',       tone: 'Playful, charming, witty',   samplesCount: 8,  isDefault: false },
];

export default function PersonalityView() {
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
  const [sample, setSample] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const makeDefault = (id: number) =>
    setProfiles((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));

  const remove = (id: number) =>
    setProfiles((prev) => prev.filter((p) => p.id !== id));

  const handleSaveProfile = async (profileData: any) => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:8000/api/personality/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: profileData.name,
            tone_rules: profileData.tone_rules,
            sample_messages: profileData.sample_messages,
            is_default: profileData.is_default
        })
      });
      const newProfile = await res.json();
      setProfiles([...profiles, { 
        id: newProfile.id, 
        name: newProfile.name, 
        tone: Object.values(newProfile.tone_rules).join(', ').substring(0, 50) + '...',
        samplesCount: newProfile.sample_messages.length,
        isDefault: newProfile.is_default
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '30px', fontWeight: '700' }}>Personality Engine</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>
          Train PAICA to speak exactly like you do across different contexts.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px', alignItems: 'start' }}>
        {/* Profiles list */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={18} color="#8b5cf6" /> Tone Profiles
            </h2>
            <button id="new-profile-btn" className="primary-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '13px' }}>
              <Plus size={15} /> New Profile
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {profiles.map((profile) => (
              <div key={profile.id} className="card-glass" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: profile.isDefault ? '1px solid rgba(99,102,241,0.3)' : undefined }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600' }}>{profile.name}</span>
                    {profile.isDefault && (
                      <span style={{ fontSize: '10px', background: '#6366f1', color: 'white', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>{profile.tone}</p>
                  <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600' }}>{profile.samplesCount} training samples</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!profile.isDefault && (
                    <button id={`set-default-${profile.id}`} onClick={() => makeDefault(profile.id)} className="glass" style={{ padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                      Set Default
                    </button>
                  )}
                  <button id={`edit-profile-${profile.id}`} className="glass" style={{ padding: '9px', borderRadius: '10px', cursor: 'pointer', border: 'none' }}>
                    <Edit3 size={16} color="rgba(255,255,255,0.7)" />
                  </button>
                  {!profile.isDefault && (
                    <button id={`delete-profile-${profile.id}`} onClick={() => remove(profile.id)} className="glass" style={{ padding: '9px', borderRadius: '10px', cursor: 'pointer', border: 'none' }}>
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick training */}
        <aside className="card-glass border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden" style={{ padding: '24px', borderRadius: '20px' }}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} className="text-indigo-400" />
          </div>
          
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Wand2 size={20} className="text-indigo-400" />
            AI Persona Lab
          </h3>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            Stop manually configuring rules! Let our AI analyze your style or interview you for perfect results.
          </p>
          
          <button 
            id="start-ai-training-btn"
            onClick={() => setIsWizardOpen(true)}
            className="primary-button w-full flex items-center justify-center gap-3 py-4 shadow-xl shadow-indigo-500/10"
          >
            <Brain size={20} />
            Personalize with AI
          </button>
          
          <div className="mt-8 pt-6 border-t border-white/5">
             <p className="text-xs text-center text-white/30">
                Powered by GPT-4 Personality Analyst
             </p>
          </div>
        </aside>
      </div>

      {isWizardOpen && (
        <PersonalityTrainingWizard 
          onClose={() => setIsWizardOpen(false)} 
          onSave={handleSaveProfile} 
        />
      )}
    </>
  );
}
