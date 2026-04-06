"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Brain, MessageCircle, ArrowRight, Check, Loader2, Send } from 'lucide-react';

interface PersonalityTrainingWizardProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PersonalityTrainingWizard({ onClose, onSave }: PersonalityTrainingWizardProps) {
  const [step, setStep] = useState<'select' | 'input-text' | 'interview' | 'review'>('select');
  const [mode, setMode] = useState<'analyze' | 'interview' | null>(null);
  
  // Analysis state
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Interview state
  const [interviewHistory, setInterviewHistory] = useState<{content: string, is_user: boolean}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  
  // Review state
  const [extractedProfile, setExtractedProfile] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [interviewHistory]);

  const handleStartAnalyze = () => {
    setMode('analyze');
    setStep('input-text');
  };

  const handleStartInterview = async () => {
    setMode('interview');
    setStep('interview');
    
    // Initial fetch for the first question
    setIsInterviewLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/personality/train/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_history: [] })
      });
      const data = await res.json();
      setInterviewHistory([{ content: data.content, is_user: false }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handleAnalyzeText = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/api/personality/train/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText })
      });
      const data = await res.json();
      setExtractedProfile(data);
      setStep('review');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInterviewSend = async () => {
    if (!userInput.trim()) return;
    
    const newHistory = [...interviewHistory, { content: userInput, is_user: true }];
    setInterviewHistory(newHistory);
    setUserInput('');
    setIsInterviewLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/api/personality/train/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_history: newHistory })
      });
      const data = await res.json();
      
      // If AI detects it has enough info, it might return a summary or a special tag
      // For now we just append the next question.
      setInterviewHistory([...newHistory, { content: data.content, is_user: false }]);
      
      // Basic check if it's a summary (in production we'd use a specific flag)
      if (data.content.toLowerCase().includes("personality profile summary") || data.content.toLowerCase().includes("summary of what i've learned")) {
         // Optionally transition to review if summary is detected
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handleCloseInterviewAndReview = async () => {
     // In a real app, we'd have another AI call to turn the interview history into the final rules
     // For this MVP, we'll trigger an "Analysis" of the interview history.
     setIsAnalyzing(true);
     setStep('review');
     const historyText = interviewHistory.map(h => `${h.is_user ? 'User' : 'Architect'}: ${h.content}`).join('\n');
     try {
        const res = await fetch('http://localhost:8000/api/personality/train/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: historyText })
        });
        const data = await res.json();
        setExtractedProfile(data);
     } catch (err) {
        console.error(err);
     } finally {
        setIsAnalyzing(false);
     }
  };

  const handleConfirmSave = () => {
    onSave({
      name: "Personalized AI",
      tone_rules: extractedProfile.tone_rules,
      sample_messages: extractedProfile.sample_messages,
      is_default: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Brain size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Personality Training</h2>
              <p className="text-xs text-white/50">Teach PAICA how you speak</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {step === 'select' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">How would you like to train your AI?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={handleStartAnalyze}
                  className="card-glass p-6 text-left hover:bg-white/10 transition-all border border-white/5"
                >
                  <div className="p-3 bg-blue-500/20 rounded-2xl w-fit mb-4">
                    <MessageSquare size={32} className="text-blue-400" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg">Analyze Chat History</h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Paste a block of your recent messages from Telegram or WhatsApp.
                  </p>
                  <div className="mt-6 flex items-center text-blue-400 text-sm font-bold gap-2">
                    Let's Analyze <ArrowRight size={16} />
                  </div>
                </button>

                <button 
                  onClick={handleStartInterview}
                  className="card-glass p-6 text-left hover:bg-white/10 transition-all border border-white/5"
                >
                  <div className="p-3 bg-purple-500/20 rounded-2xl w-fit mb-4">
                    <MessageCircle size={32} className="text-purple-400" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg">Guided Interview</h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Chat with our AI Architect for 2 minutes to define your style.
                  </p>
                  <div className="mt-6 flex items-center text-purple-400 text-sm font-bold gap-2">
                    Start Interview <ArrowRight size={16} />
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'input-text' && (
            <div className="space-y-4 h-full flex flex-col">
              <h3 className="text-lg font-medium">Analyze Chat History</h3>
              <p className="text-sm text-white/50">
                Paste at least 10-20 of your messages here. Don't worry about the formatting.
              </p>
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Ex: Hey, how are you? ... Sounds good! ... Let me check that."
                className="flex-1 min-h-[300px] w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500/50 outline-none resize-none transition-colors"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-center pt-2">
                <button onClick={() => setStep('select')} className="text-sm text-white/40 hover:text-white transition-colors">Back</button>
                <button 
                  onClick={handleAnalyzeText}
                  disabled={!rawText.trim() || isAnalyzing}
                  className="primary-button flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                  ) : (
                    <><Brain size={18} /> Analyze Persona</>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'interview' && (
            <div className="space-y-4 h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {interviewHistory.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.is_user ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        chat.is_user 
                          ? 'bg-indigo-600/80 text-white rounded-tr-none shadow-lg shadow-indigo-900/20' 
                          : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                      }`}
                    >
                      {chat.content}
                    </div>
                  </div>
                ))}
                {isInterviewLoading && (
                  <div className="flex justify-start">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Loader2 size={18} className="animate-spin text-white/40" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="relative mt-4">
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInterviewSend()}
                  placeholder="Answer here..."
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm outline-none focus:border-indigo-500/50 transition-colors"
                  disabled={isInterviewLoading}
                />
                <button 
                  onClick={handleInterviewSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-colors"
                  disabled={!userInput.trim() || isInterviewLoading}
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                 <button onClick={() => setStep('select')} className="text-white/40 hover:text-white transition-colors">Reset</button>
                 <button onClick={handleCloseInterviewAndReview} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                    Enough Info? Finish Early
                 </button>
              </div>
            </div>
          )}

          {step === 'review' && extractedProfile && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-green-400 mb-6 bg-green-400/5 p-4 rounded-2xl border border-green-400/10">
                <div className="p-2 bg-green-400/20 rounded-full">
                  <Check size={20} />
                </div>
                <div>
                    <h3 className="font-bold">Persona Extracted!</h3>
                    <p className="text-xs opacity-60">Review your new AI identity below.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Extracted Tone Rules</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(extractedProfile.tone_rules).map(([name, desc]: [string, any], idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs flex flex-col gap-1">
                        <span className="font-bold text-white/80">{name.replace(/_/g, ' ')}</span>
                        <span className="text-white/40">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Predicted Sample Messages</h4>
                   <div className="space-y-2">
                      {extractedProfile.sample_messages.map((msg: string, idx: number) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm italic opacity-80">
                          "{msg}"
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setStep('select')} className="px-6 py-2 rounded-xl hover:bg-white/10 transition-colors text-sm">Cancel</button>
                <button 
                  onClick={handleConfirmSave}
                  className="primary-button"
                >
                  Save Personality
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
