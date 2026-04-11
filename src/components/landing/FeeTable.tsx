import React from 'react'

export function FeeTable() {
  const fees = [
    { label: "Platform Fee", value: "2%", desc: "Taken from seller payout on successful release" },
    { label: "Cancellation Fee", value: "3%", desc: "Taken from buyer refund if cancelled before acceptance" },
    { label: "Dispute Bond", value: "15%", desc: "Required from buyer to open dispute (refundable if won)" }
  ]

  return (
    <section className="py-32 bg-zinc-950 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            Transparent <span className="text-cyan-400">Fees</span>
          </h2>
          <p className="text-gray-400 text-xl font-medium">Everything is on-chain and verifiable.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {fees.map((fee, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 text-center space-y-4">
              <div className="text-7xl font-black text-cyan-400">{fee.value}</div>
              <div className="text-xl font-bold">{fee.label}</div>
              <p className="text-gray-500 text-sm leading-relaxed">{fee.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
          <h4 className="text-lg font-bold mb-6 text-center">Example: $100.00 Deal</h4>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-400">
              <span>Buyer locks</span>
              <span className="text-white font-bold">100.00 USDC</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Platform fee (2%)</span>
              <span className="text-red-400 font-bold">- 2.00 USDC</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex justify-between text-xl font-black">
              <span className="text-cyan-400">Seller receives</span>
              <span className="text-cyan-400">98.00 USDC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
