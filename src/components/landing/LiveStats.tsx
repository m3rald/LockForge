import React from 'react'
import { usePlatformStats } from '../../hooks/usePlatformStats'
import { displayAmount } from '../../lib/utils'

export function LiveStats() {
  const { data: stats } = usePlatformStats()

  const items = [
    { label: 'Total Deals', value: stats ? Number(stats[0]) : '0' },
    { label: 'Open Deals', value: stats ? Number(stats[1]) : '0' },
    { label: 'Completed', value: stats ? Number(stats[2]) : '0' },
    { label: 'USDC Locked', value: stats ? displayAmount(stats[3] as bigint) : '0.00 USDC' },
    { label: 'Fees Collected', value: stats ? displayAmount(stats[4] as bigint) : '0.00 USDC' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {items.map((item, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.label}</div>
            <div className="text-2xl md:text-3xl font-black text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
