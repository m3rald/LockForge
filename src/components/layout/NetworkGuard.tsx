import React from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { AlertTriangle } from 'lucide-react'

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  if (chainId !== 5042002) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8">
          <div className="size-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="size-12 text-red-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white">Wrong Network</h2>
            <p className="text-gray-400 text-lg">
              LockForge only operates on the <span className="text-cyan-400 font-bold">Arc Testnet</span>. 
              Please switch your network to continue.
            </p>
          </div>
          <button
            onClick={() => switchChain({ chainId: 5042002 })}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xl py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          >
            Switch to Arc Testnet
          </button>
          <div className="text-sm text-gray-600">
            If auto-switch fails, manually add network ID: 5042002
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
