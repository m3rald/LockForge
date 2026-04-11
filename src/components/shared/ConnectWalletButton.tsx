import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useUsdcBalance } from '../../hooks/useUsdcBalance'
import { formatUsdc, shortAddress, explorerAddress } from '../../lib/utils'
import { Wallet, LogOut, ExternalLink, Copy, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useUsdcBalance()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard')
    }
  }

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: injected() })}
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95"
      >
        <Wallet className="size-5" />
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col items-end">
        <div className="text-xs text-gray-400 font-medium">Balance</div>
        <div className="text-sm font-bold text-cyan-400">
          {balance ? formatUsdc(balance as bigint) : '0.00'} USDC
        </div>
      </div>

      <div className="group relative">
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl hover:border-zinc-700 transition-all">
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-gray-200">
            {address ? shortAddress(address) : ''}
          </span>
          <ChevronDown className="size-4 text-gray-500 group-hover:rotate-180 transition-transform" />
        </button>

        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Copy className="size-4" />
              Copy Address
            </button>
            <a
              href={address ? explorerAddress(address) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <ExternalLink className="size-4" />
              View on ArcScan
            </a>
            <div className="h-px bg-zinc-800 my-1 mx-2" />
            <button
              onClick={() => disconnect()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="size-4" />
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
