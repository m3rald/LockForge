import React, { useState } from 'react'
import { DealWithId } from '../../lib/types'
import { displayAmount, shortAddress } from '../../lib/utils'
import { Clock, User, ArrowRight } from 'lucide-react'
import { AcceptDealModal } from './AcceptDealModal'

export function FundedDealCard({ deal }: { deal: DealWithId }) {
  const [isAcceptOpen, setIsAcceptOpen] = useState(false)

  const sellerPayout = deal.amount * 98n / 100n

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 hover:border-cyan-500/30 transition-all group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Deal #{deal.id}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="size-3" />
            <span>Posted {new Date(Number(deal.createdAt) * 1000).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-white">{displayAmount(deal.amount)}</div>
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">You receive: {displayAmount(sellerPayout)}</div>
        </div>
      </div>

      <div className="bg-zinc-950/50 rounded-2xl p-4 min-h-[80px]">
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
          {deal.descriptionIPFS}
        </p>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <User className="size-4" />
          <span>Buyer:</span>
          <span className="font-mono text-gray-400">{shortAddress(deal.buyer)}</span>
        </div>
        <div className="text-gray-400 font-bold">
          {Number(deal.deliveryDays)} Days Delivery
        </div>
      </div>

      <button
        onClick={() => setIsAcceptOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all active:scale-[0.98]"
      >
        Accept This Deal
        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <AcceptDealModal
        isOpen={isAcceptOpen}
        onClose={() => setIsAcceptOpen(false)}
        deal={deal}
      />
    </div>
  )
}
