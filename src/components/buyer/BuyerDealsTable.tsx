import React from 'react'
import { useBuyerDeals } from '../../hooks/useBuyerDeals'
import { DealCard } from './DealCard'

export function BuyerDealsTable() {
  const { deals } = useBuyerDeals()

  if (deals.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-12 text-center">
        <h3 className="text-xl font-bold mb-2 text-gray-400">No Active Deals</h3>
        <p className="text-gray-600">Your created and accepted deals will appear here.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {deals.map((deal) => (
        <div key={deal.id}>
          <DealCard deal={deal} />
        </div>
      ))}
    </div>
  )
}
