import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShoppingCart, Briefcase, Wallet, LogOut } from 'lucide-react';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';

type Role = 'buyer' | 'seller' | null;

export default function LockForgeApp() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [role, setRole] = useState<Role>(null);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neutral-200 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">LockForge</CardTitle>
            <CardDescription className="text-neutral-500">
              Decentralized Escrow on Arc Network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-neutral-600 mb-6">
              Connect your wallet to start secure peer-to-peer transactions.
            </p>
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full h-12 text-lg font-medium bg-neutral-900 hover:bg-neutral-800 transition-all"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect {connector.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Welcome to LockForge</h1>
            <p className="text-neutral-500 text-lg">Choose your role to continue</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="group cursor-pointer hover:border-neutral-900 transition-all border-2 border-transparent"
              onClick={() => setRole('buyer')}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-neutral-900 transition-colors">
                  <ShoppingCart className="w-7 h-7 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl">I am a Buyer</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-neutral-500">
                Create secure payment requests, lock funds in escrow, and approve delivery.
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer hover:border-neutral-900 transition-all border-2 border-transparent"
              onClick={() => setRole('seller')}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-neutral-900 transition-colors">
                  <Briefcase className="w-7 h-7 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl">I am a Seller</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-neutral-500">
                Browse funded requests, accept deals, and submit proof of delivery to get paid.
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => disconnect()} className="text-neutral-400 hover:text-neutral-900">
              <LogOut className="mr-2 h-4 w-4" /> Disconnect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRole(null)}>
            <Shield className="w-6 h-6 text-neutral-900" />
            <span className="font-bold text-xl tracking-tight">LockForge</span>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
              {role}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">Connected Wallet</p>
              <p className="text-sm font-mono text-neutral-900">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setRole(null)}>
              Switch Role
            </Button>
            <Button variant="ghost" size="icon" onClick={() => disconnect()}>
              <LogOut className="h-5 w-5 text-neutral-400 hover:text-neutral-900" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === 'buyer' ? <BuyerDashboard /> : <SellerDashboard />}
      </main>
    </div>
  );
}
