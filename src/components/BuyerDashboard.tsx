import React, { useState } from 'react';
import { useEscrow } from '../hooks/useEscrow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import DealCard from './DealCard';

export default function BuyerDashboard() {
  const { createDeal, deals, isLoadingDeals, address } = useEscrow();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    deliveryDays: '7',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      await createDeal(formData.description, formData.amount, parseInt(formData.deliveryDays));
      toast.success('Deal created and funds locked!');
      setFormData({ description: '', amount: '', deliveryDays: '7' });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to create deal');
    } finally {
      setIsCreating(false);
    }
  };

  const myDeals = deals?.filter((d: any) => d.buyer.toLowerCase() === address?.toLowerCase()) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Buyer Dashboard</h2>
          <p className="text-neutral-500">Manage your escrow requests and active deals.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Create New Deal
              </CardTitle>
              <CardDescription>
                Funds will be locked in the contract until you approve delivery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Project Details)</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g. Logo design for LockForge, 3 concepts, 2 revisions..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (ARC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">Delivery Days (7 - 60)</Label>
                  <Input
                    id="days"
                    type="number"
                    min="7"
                    max="60"
                    value={formData.deliveryDays}
                    onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-neutral-900" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Lock Funds & Create'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active">Active Deals ({myDeals.filter((d: any) => d.status < 3).length})</TabsTrigger>
              <TabsTrigger value="completed">History ({myDeals.filter((d: any) => d.status >= 3).length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {isLoadingDeals ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
                </div>
              ) : myDeals.filter((d: any) => d.status < 3).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-neutral-200">
                  <AlertCircle className="mx-auto h-12 w-12 text-neutral-200 mb-4" />
                  <p className="text-neutral-500">No active deals found.</p>
                </div>
              ) : (
                myDeals
                  .filter((d: any) => d.status < 3)
                  .map((deal: any) => <DealCard key={deal.id.toString()} deal={deal} role="buyer" />)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {myDeals
                .filter((d: any) => d.status >= 3)
                .map((deal: any) => <DealCard key={deal.id.toString()} deal={deal} role="buyer" />)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
