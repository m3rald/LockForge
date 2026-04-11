import React from 'react'
import { useSellerDeals } from '../../hooks/useSellerDeals'
import { SellerDealCard } from './SellerDealCard'

export function SellerDealsTable() {
  const { deals } = useSellerDeals()

  if (deals.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-12 text-center">
        <h3 className="text-xl font-bold mb-2 text-gray-400">No Active Deals</h3>
        <p className="text-gray-600">You have not accepted any deals yet. Browse open deals above.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {deals.map((deal) => (
        <div key={deal.id}>
          <SellerDealCard deal={deal} />
        </div>
      ))}
    </div>
  )
}
