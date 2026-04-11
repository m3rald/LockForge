import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectWalletButton } from '../shared/ConnectWalletButton'
import { UserRole } from '../../lib/types'

export function Navbar() {
  const location = useLocation()
  const role = localStorage.getItem('lockforge_role') as UserRole

  return (
    <nav className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center text-black font-bold text-xl">🔒</div>
          <span className="text-2xl font-bold tracking-tight text-white">LockForge</span>
        </Link>

        <div className="flex items-center gap-6">
          {role && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className={`size-2 rounded-full ${role === 'buyer' ? 'bg-blue-500' : 'bg-purple-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {role} Mode
              </span>
              <Link to="/select-role" className="ml-2 text-[10px] text-cyan-500 hover:underline">
                Switch
              </Link>
            </div>
          )}
          <ConnectWalletButton />
        </div>
      </div>
    </nav>
  )
}
