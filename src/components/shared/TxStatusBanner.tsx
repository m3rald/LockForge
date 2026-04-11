import React from 'react'
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { explorerTx } from '../../lib/utils'

export type TxStatus = 'idle' | 'approving' | 'pending' | 'success' | 'error'

interface Props {
  status: TxStatus
  txHash?: string
  error?: string
  message?: string
}

export function TxStatusBanner({ status, txHash, error, message }: Props) {
  if (status === 'idle') return null

  const configs = {
    approving: {
      icon: <Loader2 className="size-5 animate-spin text-yellow-400" />,
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      text: 'text-yellow-200',
      msg: 'Waiting for wallet signature...'
    },
    pending: {
      icon: <Loader2 className="size-5 animate-spin text-blue-400" />,
      bg: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-blue-200',
      msg: 'Transaction submitted, confirming...'
    },
    success: {
      icon: <CheckCircle2 className="size-5 text-green-400" />,
      bg: 'bg-green-500/10 border-green-500/20',
      text: 'text-green-200',
      msg: message || 'Transaction successful!'
    },
    error: {
      icon: <XCircle className="size-5 text-red-400" />,
      bg: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-200',
      msg: error || 'Transaction failed'
    }
  }

  const config = configs[status as keyof typeof configs]

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${config.bg} ${config.text} transition-all animate-in fade-in slide-in-from-top-2`}>
      <div className="flex items-center gap-3">
        {config.icon}
        <span className="text-sm font-medium">{config.msg}</span>
      </div>
      
      {txHash && (
        <a
          href={explorerTx(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold hover:underline opacity-80 hover:opacity-100"
        >
          View on ArcScan
          <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  )
}
