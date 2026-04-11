import React from 'react'
import { Lock, UserCheck, FileCheck, ShieldCheck, Coins } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: <Lock className="size-8 text-cyan-400" />,
      title: "Lock USDC",
      desc: "Buyer creates a deal and locks the full payment in the smart contract."
    },
    {
      icon: <UserCheck className="size-8 text-cyan-400" />,
      title: "Seller Accepts",
      desc: "A seller browses open deals and accepts the terms and deadline."
    },
    {
      icon: <FileCheck className="size-8 text-cyan-400" />,
      title: "Submit Proof",
      desc: "Seller completes work and submits an IPFS proof to the contract."
    },
    {
      icon: <ShieldCheck className="size-8 text-cyan-400" />,
      title: "Buyer Review",
      desc: "Buyer has 24 hours to review. If no dispute, funds auto-release."
    },
    {
      icon: <Coins className="size-8 text-cyan-400" />,
      title: "Get Paid",
      desc: "Funds are released to the seller's wallet automatically."
    }
  ]

  return (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
          How <span className="text-cyan-400">LockForge</span> Works
        </h2>
        <p className="text-gray-400 text-xl font-medium">Trustless settlement in five simple steps.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative group">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 h-full hover:border-cyan-500/50 transition-all duration-500 hover:bg-zinc-900">
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
            </div>
            {i < 4 && (
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-zinc-800 z-0" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
