import React, { useState } from 'react'
import { useFundedDeals } from '../../hooks/useFundedDeals'
import { FundedDealCard } from './FundedDealCard'
import { RefreshCcw, Search, SlidersHorizontal } from 'lucide-react'

export function BrowseDeals() {
  const { deals, refetch } = useFundedDeals()
  const [search, setSearch] = useState('')
  const [minAmount, setMinAmount] = useState('')

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.descriptionIPFS.toLowerCase().includes(search.toLowerCase())
    const matchesAmount = minAmount ? Number(deal.amount) / 1_000_000 >= Number(minAmount) : true
    return matchesSearch && matchesAmount
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Description</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by keywords..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-cyan-500/50 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Min Amount (USDC)</label>
            <div className="relative">
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:border-cyan-500/50 outline-none"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={() => refetch()}
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-gray-400"
          title="Refresh Deals"
        >
          <RefreshCcw className="size-5" />
        </button>
      </div>

      {filteredDeals.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-12 text-center">
          <h3 className="text-xl font-bold mb-2 text-gray-400">No Open Deals</h3>
          <p className="text-gray-600">Check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id}>
              <FundedDealCard deal={deal} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
