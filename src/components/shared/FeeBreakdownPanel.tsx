import React from 'react'
import { useFeeBreakdown } from '../../hooks/useFeeBreakdown'
import { formatUsdc, displayAmount } from '../../lib/utils'

export function FeeBreakdownPanel({ amount }: { amount: bigint }) {
  const { data: breakdown } = useFeeBreakdown(amount)

  if (!breakdown || amount < 1_000_000n) return null

  const [platformFee, sellerPayout, cancelFee, cancelRefund, disputeBond, gasEstimate, createTotalCost] = breakdown as [bigint, bigint, bigint, bigint, bigint, bigint, bigint]

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Deal Summary</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">You lock (escrow)</span>
          <span className="font-bold text-gray-200">{displayAmount(amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Platform fee (2%)</span>
          <span className="font-bold text-gray-200">{displayAmount(platformFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Seller receives</span>
          <span className="font-bold text-cyan-400">{displayAmount(sellerPayout)}</span>
        </div>
        
        <div className="h-px bg-zinc-800 my-2" />
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Approve gas</span>
          <span className="font-medium text-gray-400">~0.01 USDC</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Create deal gas</span>
          <span className="font-medium text-gray-400">~0.01 USDC</span>
        </div>
        
        <div className="flex justify-between text-lg pt-2">
          <span className="font-bold text-gray-300">Total you spend</span>
          <span className="font-black text-cyan-400">{displayAmount(createTotalCost)}</span>
        </div>
      </div>
    </div>
  )
}
