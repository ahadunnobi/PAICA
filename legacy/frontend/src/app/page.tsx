"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardView   from '@/components/DashboardView';
import MessagesView    from '@/components/MessagesView';
import ApprovalsView   from '@/components/ApprovalsView';
import PersonalityView from '@/components/PersonalityView';
import AnalyticsView   from '@/components/AnalyticsView';
import SafetyView      from '@/components/SafetyView';
import ConnectionsView from '@/components/ConnectionsView';

type Tab = 'inbox' | 'messages' | 'approvals' | 'personality' | 'analytics' | 'safety' | 'connections';

const VIEW_MAP: Record<Tab, React.ReactNode> = {
  inbox:       <DashboardView />,
  messages:    <MessagesView />,
  approvals:   <ApprovalsView />,
  personality: <PersonalityView />,
  analytics:   <AnalyticsView />,
  safety:      <SafetyView />,
  connections: <ConnectionsView />,
};

export default function RootPage() {
  const [activeTab, setActiveTab] = useState<Tab>('inbox');

  return (
    <main style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activeTab={activeTab} setActiveTab={(t) => setActiveTab(t as Tab)} />

      {/* Animated content area */}
      <div
        key={activeTab}
        className="content-area"
        style={{
          flex: 1,
          padding: '40px 48px',
          overflowY: 'auto',
          animation: 'fadeSlideIn 0.25s ease',
        }}
      >
        {VIEW_MAP[activeTab]}
      </div>
    </main>
  );
}
