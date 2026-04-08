import { useEscrow } from '../hooks/useEscrow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Briefcase } from 'lucide-react';
import DealCard from './DealCard';

export default function SellerDashboard() {
  const { deals, isLoadingDeals, address } = useEscrow();

  const availableDeals = deals?.filter((d: any) => d.status === 0) || [];
  const myAcceptedDeals = deals?.filter((d: any) => d.seller.toLowerCase() === address?.toLowerCase()) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Seller Dashboard</h2>
        <p className="text-neutral-500">Browse available requests or manage your accepted jobs.</p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
          <TabsTrigger value="browse" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Browse Funded ({availableDeals.length})
          </TabsTrigger>
          <TabsTrigger value="my-jobs" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            My Accepted ({myAcceptedDeals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {isLoadingDeals ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
          ) : availableDeals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
              <Search className="mx-auto h-12 w-12 text-neutral-200 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900">No funded deals available</h3>
              <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                Check back later for new requests from buyers.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {availableDeals.map((deal: any) => (
                <DealCard key={deal.id.toString()} deal={deal} role="seller" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-jobs" className="space-y-6">
          {myAcceptedDeals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
              <Briefcase className="mx-auto h-12 w-12 text-neutral-200 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900">You haven't accepted any deals yet</h3>
              <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                Browse the marketplace to find funded requests that match your skills.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myAcceptedDeals.map((deal: any) => (
                <DealCard key={deal.id.toString()} deal={deal} role="seller" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
