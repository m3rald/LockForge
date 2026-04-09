import React from 'react';
import { useAccount } from 'wagmi';
import { useEscrow } from '../hooks/useEscrow';
import { DealCard, Deal } from './DealCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Briefcase, CheckCircle2 } from 'lucide-react';

export function SellerDashboard() {
  const { address } = useAccount();
  const { deals, isLoadingDeals } = useEscrow();

  const allDeals = deals as Deal[] || [];
  
  // Deals available to be accepted (Status: Funded, Seller: 0x0)
  const availableDeals = allDeals.filter(d => 
    d.status === 0 && 
    d.seller === '0x0000000000000000000000000000000000000000' &&
    d.buyer.toLowerCase() !== address?.toLowerCase()
  );

  // Deals I have accepted
  const myAcceptedDeals = allDeals.filter(d => 
    d.seller.toLowerCase() === address?.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="browse" className="data-[state=active]:bg-white">
              <Search className="mr-2 h-4 w-4" /> Browse Funded Deals
            </TabsTrigger>
            <TabsTrigger value="my-work" className="data-[state=active]:bg-white">
              <Briefcase className="mr-2 h-4 w-4" /> My Accepted Deals
            </TabsTrigger>
          </TabsList>
          <div className="hidden sm:block text-xs text-slate-500 font-medium">
            {availableDeals.length} Opportunities Available
          </div>
        </div>

        <TabsContent value="browse" className="space-y-6 outline-none">
          <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Verified Opportunities
            </h3>
            <p className="text-xs text-indigo-700 mt-1">
              All deals listed here are fully funded. The USDC tokens are locked in the smart contract.
            </p>
          </div>

          {isLoadingDeals ? (
            <div className="py-12 text-center text-slate-400">Scanning for deals...</div>
          ) : availableDeals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
              <Search className="mx-auto h-12 w-12 text-slate-200" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No deals found</h3>
              <p className="mt-1 text-slate-500">Check back later for new funded requests.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {availableDeals.map(deal => (
                <DealCard key={deal.id.toString()} deal={deal} role="seller" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-work" className="space-y-6 outline-none">
          {myAcceptedDeals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-slate-200" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No active work</h3>
              <p className="mt-1 text-slate-500">Accept a deal from the browse tab to start earning.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {myAcceptedDeals.map(deal => (
                <DealCard key={deal.id.toString()} deal={deal} role="seller" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
