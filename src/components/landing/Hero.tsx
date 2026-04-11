import React from 'react'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useNavigate } from 'react-router-dom'

export function Hero() {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const navigate = useNavigate()

  const handleCTA = () => {
    if (isConnected) {
      navigate('/select-role')
    } else {
      connect({ connector: injected() })
    }
  }

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
          Trustless Escrow for the <br />
          <span className="text-cyan-400">Internet Economy</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-xl md:text-2xl font-medium leading-relaxed mb-12">
          Lock USDC. Deliver work. Get paid — automatically. <br />
          Built for freelancers, agencies, and trustless commerce.
        </p>
        
        <button 
          onClick={handleCTA}
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-black text-2xl px-16 py-6 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]"
        >
          {isConnected ? 'Go to Dashboard' : 'Connect Wallet to Start'}
        </button>
      </div>
    </section>
  )
}
