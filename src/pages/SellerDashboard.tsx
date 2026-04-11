import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { BrowseDeals } from '../components/seller/BrowseDeals'
import { SellerDealsTable } from '../components/seller/SellerDealsTable'
import { Search, Briefcase } from 'lucide-react'
import { useSellerDeals } from '../hooks/useSellerDeals'
import { useFundedDeals } from '../hooks/useFundedDeals'

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<'browse' | 'active'>('browse')
  const { deals: activeDeals } = useSellerDeals()
  const { deals: openDeals } = useFundedDeals()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'browse' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="size-5" />
                Browse Deals
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'browse' ? 'bg-black/20' : 'bg-zinc-800'}`}>
                {openDeals.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'active' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="size-5" />
                Active Deals
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-black/20' : 'bg-zinc-800'}`}>
                {activeDeals.length}
              </span>
            </button>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'browse' ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black">Open Opportunities</h2>
                  <p className="text-gray-400">Accept deals and start earning USDC on Arc.</p>
                </div>
                <BrowseDeals />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black">My Active Work</h2>
                  <p className="text-gray-400">Manage your accepted deals and submit proofs.</p>
                </div>
                <SellerDealsTable />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
