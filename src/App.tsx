/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmi';
import { Toaster } from './components/ui/sonner';
import { WalletConnect } from './components/wallet/WalletConnect';
import { CreateDealForm } from './components/CreateDealForm';
import { DealList } from './components/DealList';

const queryClient = new QueryClient();

function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center text-black font-bold text-xl">🔒</div>
            <span className="text-2xl font-bold tracking-tight">LockForge</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#how" className="hover:text-cyan-400 transition">How It Works</a>
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#fees" className="hover:text-cyan-400 transition">Fees</a>
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Hero + How It Works */}
      <section id="how" className="pt-48 pb-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            How <span className="text-cyan-400">LockForge</span> Works
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-xl md:text-2xl font-medium leading-relaxed">
            Four simple steps from deal creation to trustless settlement on the Arc Network.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Create Deal", desc: "Buyer defines terms, sets delivery deadline (7–60 days), and locks USDC in the contract." },
            { step: "02", title: "Seller Accepts", desc: "A seller picks up the deal and commits to deliver before the deadline." },
            { step: "03", title: "Submit Proof", desc: "Seller uploads proof of delivery to IPFS. A 24-hour review window opens for the buyer." },
            { step: "04", title: "Release or Dispute", desc: "Buyer approves release, or opens a dispute with a 15% bond. Funds auto-release after 24h if no dispute." }
          ].map((item, i) => (
            <div key={i} className="group bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 hover:border-cyan-500/50 transition-all duration-500 hover:bg-zinc-900">
              <div className="text-cyan-400 text-4xl font-black mb-6 opacity-50 group-hover:opacity-100 transition-opacity">{item.step}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fees Section */}
      <section id="fees" className="bg-zinc-950 py-32 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            Transparent <span className="text-cyan-400">Fee Structure</span>
          </h2>
          <p className="text-gray-400 text-xl mb-20">No hidden costs. Everything is on-chain and verifiable.</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { val: "2%", title: "Platform Fee", desc: "On successful deals" },
              { val: "3%", title: "Cancellation Fee", desc: "Before seller accepts" },
              { val: "15%", title: "Dispute Bond", desc: "Refundable if won" }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 hover:scale-[1.02] transition-transform">
                <div className="text-7xl font-black text-cyan-400 mb-6">{item.val}</div>
                <p className="text-xl font-bold mb-2">{item.title}</p>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center py-32">
        <button 
          onClick={onLaunch}
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-black text-2xl px-16 py-6 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]"
        >
          Launch App on Arc Testnet
        </button>
      </div>

      <footer className="py-12 border-t border-zinc-900 text-center text-gray-600 text-sm">
        <p>© 2026 LockForge Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
}

function AppContent() {
  const [view, setView] = useState<'landing' | 'app'>('landing');

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setView('landing')} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center text-black font-bold text-xl">🔒</div>
            <span className="text-2xl font-bold tracking-tight">LockForge</span>
          </button>
          <WalletConnect />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-4">Dashboard</h1>
          <p className="text-gray-400">Manage your escrow deals on the Arc Network.</p>
        </div>
        
        <div className="grid gap-12">
          <CreateDealForm />
          
          <DealList />
          
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-12 text-center">
            <h3 className="text-xl font-bold mb-2 text-gray-400">No Active Deals</h3>
            <p className="text-gray-600">Your created and accepted deals will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
