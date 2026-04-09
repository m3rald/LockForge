import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEscrow } from '../hooks/useEscrow';
import { DealCard, Deal } from './DealCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseUnits } from 'viem';
import { USDC_DECIMALS } from '../lib/abi';
import { Plus, ListFilter, History, ShieldCheck } from 'lucide-react';

export function BuyerDashboard() {
  const { address } = useAccount();
  const { deals, createDeal, isLoadingDeals } = useEscrow();
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    deliveryDays: '7'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createDeal(
        formData.description,
        parseUnits(formData.amount, USDC_DECIMALS),
        parseInt(formData.deliveryDays)
      );
      setFormData({ description: '', amount: '', deliveryDays: '7' });
    } finally {
      setIsCreating(false);
    }
  };

  const myDeals = (deals as Deal[] || []).filter(d => d.buyer.toLowerCase() === address?.toLowerCase());
  const activeDeals = myDeals.filter(d => d.status < 3);
  const completedDeals = myDeals.filter(d => d.status >= 3);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Create Deal Form */}
        <Card className="lg:col-span-1 border-indigo-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Plus className="h-5 w-5" /> Create New Deal
            </CardTitle>
            <CardDescription>
              Funds will be locked in escrow until you approve delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="desc">Service Description</Label>
                <Textarea 
                  id="desc" 
                  placeholder="Describe the work to be done..." 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USDC)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01" 
                    placeholder="10.0" 
                    required
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">Delivery Days</Label>
                  <Input 
                    id="days" 
                    type="number" 
                    min="7" 
                    max="60" 
                    required
                    value={formData.deliveryDays}
                    onChange={e => setFormData({...formData, deliveryDays: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isCreating}>
                {isCreating ? 'Creating Escrow...' : 'Lock Funds & Create'}
              </Button>
              <p className="text-[10px] text-center text-slate-500">
                By creating a deal, you agree to the LockForge Escrow Terms.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* My Deals List */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="active" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger value="active" className="data-[state=active]:bg-white">
                  <ListFilter className="mr-2 h-4 w-4" /> Active Deals
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white">
                  <History className="mr-2 h-4 w-4" /> History
                </TabsTrigger>
              </TabsList>
              <div className="text-xs text-slate-500 font-medium">
                {myDeals.length} Total Deals
              </div>
            </div>

            <TabsContent value="active" className="space-y-4 outline-none">
              {isLoadingDeals ? (
                <div className="py-12 text-center text-slate-400">Loading deals...</div>
              ) : activeDeals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <ShieldCheck className="mx-auto h-12 w-12 text-slate-200" />
                  <h3 className="mt-4 text-lg font-medium text-slate-900">No active deals</h3>
                  <p className="mt-1 text-slate-500">Create your first escrow request to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
                  {activeDeals.map(deal => (
                    <DealCard key={deal.id.toString()} deal={deal} role="buyer" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 outline-none">
              {completedDeals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <History className="mx-auto h-12 w-12 text-slate-200" />
                  <h3 className="mt-4 text-lg font-medium text-slate-900">No history yet</h3>
                  <p className="mt-1 text-slate-500">Completed and disputed deals will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
                  {completedDeals.map(deal => (
                    <DealCard key={deal.id.toString()} deal={deal} role="buyer" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
