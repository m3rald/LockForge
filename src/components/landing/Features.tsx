import React from 'react'
import { Shield, Zap, RefreshCcw, Lock } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Shield className="size-6" />,
      title: "Trustless Escrow",
      desc: "No middleman. The smart contract holds funds and enforces the rules."
    },
    {
      icon: <Zap className="size-6" />,
      title: "USDC-Native Gas",
      desc: "Pay gas fees directly in USDC on the Arc Network. No need for native tokens."
    },
    {
      icon: <RefreshCcw className="size-6" />,
      title: "Auto-Release",
      desc: "Funds release automatically after 24 hours if the buyer doesn't dispute."
    },
    {
      icon: <Lock className="size-6" />,
      title: "Dispute Protection",
      desc: "Fair dispute resolution with refundable bonds to prevent spam."
    }
  ]

  return (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 space-y-6 hover:scale-[1.02] transition-transform">
            <div className="size-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
              {f.icon}
            </div>
            <h3 className="text-2xl font-bold">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
