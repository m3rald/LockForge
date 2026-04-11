import { DealStatus } from './types'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GAS_ESTIMATE_USDC6 = 10_000n  // 0.01 USDC per tx

// Convert raw 6-decimal bigint to display string
// e.g. 5_000_000n → "5.00"
export function formatUsdc(raw: bigint): string {
  return (Number(raw) / 1_000_000).toFixed(2)
}

// Show both USDC and USD (1:1 peg)
// e.g. 5_000_000n → "5.00 USDC (≈ $5.00)"
export function displayAmount(raw: bigint): string {
  const val = formatUsdc(raw)
  return `${val} USDC (≈ $${val})`
}

// Convert user-entered float to 6-decimal bigint
// e.g. "5.50" → 5_500_000n
export function toUsdc6(usdcFloat: string | number): bigint {
  return BigInt(Math.round(Number(usdcFloat) * 1_000_000))
}

// Truncate address
export function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// Seconds remaining → human readable
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Expired'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

// Countdown color based on urgency
export function countdownColor(seconds: number): string {
  if (seconds > 43200) return 'text-green-400'   // > 12h
  if (seconds > 21600) return 'text-yellow-400'  // > 6h
  return 'text-red-400'                           // < 6h
}

// Explorer URL builder
export function explorerTx(hash: string): string {
  return `https://testnet.arcscan.app/tx/${hash}`
}
export function explorerAddress(addr: string): string {
  return `https://testnet.arcscan.app/address/${addr}`
}

// Status label and color
export function statusLabel(status: DealStatus): string {
  const labels = {
    0: 'Open',
    1: 'In Progress',
    2: 'Proof Submitted',
    3: 'Disputed',
    4: 'Completed',
    5: 'Cancelled',
    6: 'Refunded'
  }
  return labels[status] ?? 'Unknown'
}

export function statusColor(status: DealStatus): string {
  const colors = {
    0: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    3: 'bg-red-500/20 text-red-400 border-red-500/30',
    4: 'bg-green-500/20 text-green-400 border-green-500/30',
    5: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    6: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
  return colors[status] ?? ''
}
