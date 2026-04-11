import React from 'react'
import { DealStatus } from '../../lib/types'
import { statusLabel, statusColor } from '../../lib/utils'

export function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(status)}`}>
      {statusLabel(status)}
    </span>
  )
}
