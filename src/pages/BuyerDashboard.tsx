import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { CreateDealForm } from '../components/buyer/CreateDealForm'
import { BuyerDealsTable } from '../components/buyer/BuyerDealsTable'
import { Plus, List } from 'lucide-react'
import { useBuyerDeals } from '../hooks/useBuyerDeals'

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'deals'>('create')
  const { deals } = useBuyerDeals()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'create' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-zinc-900'
              }`}
            >
              <Plus className="size-5" />
              Create Deal
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'deals' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <List className="size-5" />
                My Deals
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'deals' ? 'bg-black/20' : 'bg-zinc-800'}`}>
                {deals.length}
              </span>
            </button>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-3xl">
            {activeTab === 'create' ? (
              <CreateDealForm />
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black">My Escrow Deals</h2>
                  <p className="text-gray-400">Manage your active and past deals as a buyer.</p>
                </div>
                <BuyerDealsTable />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
