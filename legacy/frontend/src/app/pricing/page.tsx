"use client"

import React, { useState } from 'react'
import Link from 'next/link'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const tiers = [
    {
      name: "Hobbyist",
      price: "0",
      description: "Perfect for testing the AI's capabilities.",
      features: [
        "1 Platform Connection",
        "20 AI Replies / Month",
        "1 Personality Profile",
        "GPT-4o mini Access",
        "Standard Speed",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: isAnnual ? "24" : "29",
      description: "For users who want to stay connected everywhere.",
      features: [
        "Unlimited Platforms",
        "1,000 AI Replies / Month",
        "5 Personality Profiles",
        "GPT-4o Access",
        "High Priority Speed",
        "Early Access Features",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Elite",
      price: isAnnual ? "79" : "99",
      description: "Maximum power for serious communication.",
      features: [
        "Unlimited Everything",
        "Unlimited AI Replies",
        "Unlimited Profiles",
        "Custom Fine-tuned Models",
        "Real-time Dedicated Speed",
        "VIP Support",
      ],
      cta: "Become Elite",
      popular: false,
    },
  ]

  const handleCheckout = async (tier: string) => {
    // In a real app, this would hit the backend create-checkout-session endpoint
    // For now, we'll just alert or console log
    console.log(`Starting checkout for ${tier}`)
    alert("Redirecting to Stripe Checkout...")
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white selection:bg-[#3B82F6]/30">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6366F1]/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#6366F1] bg-clip-text text-transparent">
          PAICA
        </Link>
        <div className="flex gap-8 items-center text-sm font-medium text-gray-400">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="text-white">Pricing</Link>
          <Link href="/login" className="px-5 py-2 rounded-full border border-gray-800 hover:border-gray-700 hover:bg-white/5 transition-all">Log In</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Simple, <span className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] bg-clip-text text-transparent">Transparent</span> Pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Choose the plan that fits your communication needs. From casual chats to high-volume business interactions.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-gray-800 relative transition-colors hover:bg-gray-700"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-[#3B82F6] transition-all ${isAnnual ? 'left-7' : 'left-1'}`} />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-500'}`}>Annual <span className="text-[#10B981] ml-1 font-semibold">(Save 20%)</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
                tier.popular 
                  ? 'bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A]/80 border-[#3B82F6]/50 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]' 
                  : 'bg-white/5 border-gray-800 hover:border-gray-700'
              } backdrop-blur-xl`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#3B82F6] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCheckout(tier.name.toLowerCase())}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  tier.popular 
                    ? 'bg-[#3B82F6] hover:bg-[#2563EB] shadow-lg shadow-blue-500/20' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-3xl bg-gradient-to-r from-white/5 to-transparent border border-gray-800 text-center">
            <h3 className="text-2xl font-bold mb-4">Need a custom plan?</h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                We offer enterprise-level customization, dedicated support, and higher volume caps for agencies and large organizations.
            </p>
            <button className="px-8 py-3 rounded-xl border border-gray-700 hover:bg-white/5 transition-all font-medium">
                Contact Sales
            </button>
        </div>
      </main>

      <footer className="border-t border-gray-900 py-10 mt-20 text-center text-gray-500 text-sm">
        <p>&copy; 2026 PAICA. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default PricingPage
