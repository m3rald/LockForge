import React from 'react'

export function Footer() {
  return (
    <footer className="py-20 border-t border-zinc-900 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center text-black font-bold text-xl">🔒</div>
          <span className="text-2xl font-bold tracking-tight text-white">LockForge</span>
        </div>
        
        <div className="flex gap-12 text-sm font-medium text-gray-500">
          <a href="https://testnet.arcscan.app" target="_blank" className="hover:text-cyan-400 transition">Arc Explorer</a>
          <a href="https://faucet.circle.com" target="_blank" className="hover:text-cyan-400 transition">Circle Faucet</a>
          <a href="#" className="hover:text-cyan-400 transition">Documentation</a>
        </div>
        
        <div className="text-gray-600 text-sm">
          © 2026 LockForge Protocol. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
