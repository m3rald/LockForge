import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { BuyerDashboard } from './BuyerDashboard';
import { SellerDashboard } from './SellerDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Wallet, LogOut, UserCircle, ShoppingBag, Store, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Role = 'buyer' | 'seller' | null;

export function LockForgeApp() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [role, setRole] = useState<Role>(null);

  // Persistence for role (optional, but good for UX)
  useEffect(() => {
    const savedRole = localStorage.getItem('lockforge-role') as Role;
    if (savedRole) setRole(savedRole);
  }, []);

  const handleRoleSelect = (newRole: Role) => {
    setRole(newRole);
    if (newRole) localStorage.setItem('lockforge-role', newRole);
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <Card className="w-full max-w-md border-indigo-100 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Shield className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tight text-slate-900">LockForge</CardTitle>
              <CardDescription className="text-slate-500">
                Secure, decentralized escrow for the Arc Network.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <p>Funds are locked in a smart contract until delivery is approved.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <p>Built-in dispute resolution with bond requirements.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <p>Zero-trust architecture powered by Arc Network.</p>
              </div>
            </div>
            <Button 
              className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" 
              onClick={() => connect({ connector: injected() })}
            >
              <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
            </Button>
            <div className="text-center">
              <Dialog>
                <DialogTrigger render={<Button variant="link" className="text-xs text-slate-400 hover:text-indigo-600" />}>
                  <Info className="mr-1 h-3 w-3" /> How it works
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>LockForge Protocol Rules</DialogTitle>
                    <DialogDescription>
                      <div className="space-y-4 py-4 text-slate-700">
                        <section>
                          <h4 className="font-bold text-slate-900">1. Funding</h4>
                          <p>Buyers create a deal and lock 100% of the service fee in USDC plus gas. Funds are held by the smart contract.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-slate-900">2. Acceptance</h4>
                          <p>Sellers browse funded deals and accept them. A deal can only have one seller at a time.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-slate-900">3. Delivery</h4>
                          <p>Sellers submit an IPFS link as proof of delivery. This moves the deal to "Reviewing" status.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-slate-900">4. Release or Dispute</h4>
                          <p>Buyers have the option to Approve (releasing funds to seller) or Dispute. Disputes require a 15% bond from the buyer to prevent spam.</p>
                        </section>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Choose Your Role</h2>
            <p className="text-slate-500">Select how you want to interact with LockForge today.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card 
              className="cursor-pointer border-2 border-transparent transition-all hover:border-indigo-500 hover:shadow-xl group"
              onClick={() => handleRoleSelect('buyer')}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl">I am a Buyer</CardTitle>
                <CardDescription>I want to hire services and secure my funds.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-500 text-center">
                Create escrow requests, manage your active deals, and approve deliveries.
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer border-2 border-transparent transition-all hover:border-emerald-500 hover:shadow-xl group"
              onClick={() => handleRoleSelect('seller')}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Store className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl">I am a Seller</CardTitle>
                <CardDescription>I want to find work and get paid securely.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-500 text-center">
                Browse funded requests, accept deals, and submit proof of work.
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => disconnect()} className="text-slate-400">
              <LogOut className="mr-2 h-4 w-4" /> Disconnect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">LockForge</span>
            <Badge variant="secondary" className="ml-2 font-mono text-[10px] uppercase tracking-widest">
              {role}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <UserCircle className="h-4 w-4" />
              <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleRoleSelect(null)} className="text-slate-500 hover:text-indigo-600">
              Switch Role
            </Button>
            <Button variant="ghost" size="icon" onClick={() => disconnect()} className="text-slate-400 hover:text-red-500">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {role === 'buyer' ? <BuyerDashboard /> : <SellerDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 LockForge Protocol. Secured by Arc Network.</p>
        </div>
      </footer>
    </div>
  );
}
