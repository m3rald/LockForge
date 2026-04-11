import React from 'react'
import { formatCountdown, countdownColor } from '../../lib/utils'

export function CountdownTimer({ seconds }: { seconds: number }) {
  return (
    <span className={`font-mono font-bold ${countdownColor(seconds)}`}>
      {formatCountdown(seconds)}
    </span>
  )
}
