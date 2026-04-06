"use client"

import React, { useState, useEffect } from 'react'

const BillingDashboard = () => {
  const [usage, setUsage] = useState({
    limit: 1000,
    used: 425,
    platforms: 3,
    profiles: 2,
  })

  const [subscription, setSubscription] = useState({
    tier: "Professional",
    status: "Active",
    nextBilling: "April 24, 2026",
    amount: "$29.00",
  })

  const percentage = (usage.used / usage.limit) * 100

  const handleManage = () => {
    alert("Redirecting to Stripe Customer Portal...")
  }

  const handleTopUp = () => {
    alert("Opening top-up options...")
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Billing & Usage</h1>
        <p className="text-gray-400">Manage your subscription, view usage, and update payment methods.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan Card */}
          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#3B82F6] mb-2 block">Current Plan</span>
                <h2 className="text-2xl font-bold">{subscription.tier} Plan</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold border border-[#10B981]/20">
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-gray-500 text-sm mb-1">Next Billing Date</p>
                <p className="font-medium">{subscription.nextBilling}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Amount</p>
                <p className="font-medium">{subscription.amount} / mo</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleManage}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold"
              >
                Manage Subscription
              </button>
              <button className="px-6 py-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-all text-sm font-medium">
                View Invoices
              </button>
            </div>
          </div>

          {/* Usage Stats Card */}
          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Usage this month</h3>
              <span className="text-sm text-gray-400">{usage.used} / {usage.limit} AI Replies</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-gray-800/50">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-bold">Connected Platforms</p>
                <p className="text-xl font-bold">{usage.platforms} <span className="text-sm font-normal text-gray-500">/ Unlimited</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-gray-800/50">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-bold">Personality Profiles</p>
                <p className="text-xl font-bold">{usage.profiles} <span className="text-sm font-normal text-gray-500">/ 5</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Top-ups */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#3B82F6]/30 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
            
            <h3 className="text-lg font-bold mb-4">Running low on credits?</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Purchase an instant top-up to keep your AI running smoothly until the next billing cycle.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 text-sm border border-white/5 hover:border-[#3B82F6]/50 transition-colors cursor-pointer">
                <span>200 Replies</span>
                <span className="font-bold">$5.00</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 text-sm border border-white/5 hover:border-[#3B82F6]/50 transition-colors cursor-pointer">
                <span>500 Replies</span>
                <span className="font-bold">$10.00</span>
              </div>
            </div>

            <button 
              onClick={handleTopUp}
              className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-bold shadow-lg shadow-blue-500/20"
            >
              Buy Top-up
            </button>
          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-6">
            <h4 className="font-bold mb-3 text-sm text-gray-300">Payment Method</h4>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-gray-800">
              <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold">VISA</span>
              </div>
              <div>
                <p className="text-xs font-bold">•••• 4242</p>
                <p className="text-[10px] text-gray-500">Expires 12/28</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingDashboard
