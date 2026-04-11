import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { UserRole } from '../lib/types'
import { ShoppingBag, Store, ArrowRight } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'

export default function SelectRole() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const [buyerAgreed, setBuyerAgreed] = useState(false)
  const [sellerAgreed, setSellerAgreed] = useState(false)

  const handleSelect = (role: UserRole) => {
    localStorage.setItem('lockforge_role', role!)
    navigate(role === 'buyer' ? '/buyer' : '/seller')
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white">Please connect your wallet</h2>
          <button onClick={() => navigate('/')} className="text-cyan-500 hover:underline">Return to Landing</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black tracking-tighter">Choose Your Role</h1>
          <p className="text-gray-400 text-lg">Select how you want to use LockForge today.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Buyer Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 hover:border-blue-500/30 transition-all flex flex-col">
            <div className="size-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <ShoppingBag className="size-8" />
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="text-3xl font-bold">I'm a Buyer</h2>
              <p className="text-gray-400 leading-relaxed">
                Create escrow deals, lock USDC, and approve or dispute delivery. Perfect for hiring freelancers or buying services.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="buyer-agree"
                  checked={buyerAgreed}
                  onChange={(e) => setBuyerAgreed(e.target.checked)}
                  className="mt-1 size-4 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="buyer-agree" className="text-xs text-gray-500 cursor-pointer">
                  I understand funds are locked until delivery or cancellation.
                </label>
              </div>
              <button
                onClick={() => handleSelect('buyer')}
                disabled={!buyerAgreed}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:bg-zinc-800 disabled:text-gray-600 text-black font-black py-4 rounded-2xl transition-all"
              >
                Start as Buyer
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 hover:border-purple-500/30 transition-all flex flex-col">
            <div className="size-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
              <Store className="size-8" />
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="text-3xl font-bold">I'm a Seller</h2>
              <p className="text-gray-400 leading-relaxed">
                Browse open deals, accept work, submit proof, and get paid. Ideal for freelancers and service providers.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="seller-agree"
                  checked={sellerAgreed}
                  onChange={(e) => setSellerAgreed(e.target.checked)}
                  className="mt-1 size-4 rounded border-zinc-700 bg-zinc-950 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="seller-agree" className="text-xs text-gray-500 cursor-pointer">
                  I understand I must deliver within the agreed timeframe.
                </label>
              </div>
              <button
                onClick={() => handleSelect('seller')}
                disabled={!sellerAgreed}
                className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 disabled:bg-zinc-800 disabled:text-gray-600 text-black font-black py-4 rounded-2xl transition-all"
              >
                Start as Seller
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
