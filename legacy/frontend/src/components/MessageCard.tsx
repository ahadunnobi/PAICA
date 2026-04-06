import React from 'react';
import { Send, Clock, User, Facebook, Mail, MessageSquare } from 'lucide-react';

interface MessageCardProps {
  sender: string;
  platform: string;
  content: string;
  intent: string;
  time: string;
}

export default function MessageCard({ sender, platform, content, intent, time }: MessageCardProps) {
  const getPlatformIcon = () => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Facebook size={14} color="#e1306c" />;
      case 'email': return <Mail size={14} color="#ea4335" />;
      case 'telegram': return <MessageSquare size={14} color="#0088cc" />;
      case 'whatsapp': return <MessageSquare size={14} color="#25D366" />;
      default: return <User size={14} />;
    }
  };

  const getIntentColor = () => {
    switch (intent.toLowerCase()) {
      case 'business': return '#3b82f6';
      case 'casual': return '#10b981';
      case 'flirting': return '#ec4899';
      case 'urgent': return '#ef4444';
      default: return 'rgba(255,255,255,0.5)';
    }
  };

  return (
    <div className="card-glass" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', cursor: 'pointer' }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '12px', 
        background: 'rgba(255,255,255,0.05)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0 
      }}>
        <User size={24} color="rgba(255,255,255,0.3)" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>{sender}</span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '4px 8px', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              {getPlatformIcon()}
              {platform}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {time}
          </span>
        </div>

        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', marginBottom: '12px' }}>
          {content}
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            padding: '4px 10px', 
            borderRadius: '20px', 
            fontSize: '11px', 
            fontWeight: '700', 
            textTransform: 'uppercase',
            background: `${getIntentColor()}15`,
            color: getIntentColor(),
            border: `1px solid ${getIntentColor()}30`
          }}>
            {intent}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Send size={12} />
            AI Ready
          </div>
        </div>
      </div>
    </div>
  );
}
