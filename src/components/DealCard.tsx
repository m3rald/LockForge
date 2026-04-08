import React, { useState } from 'react';
import { formatEther } from 'viem';
import { useEscrow } from '../hooks/useEscrow';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, CheckCircle2, AlertTriangle, ExternalLink, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DealCardProps {
  deal: any;
  role: 'buyer' | 'seller';
  key?: any;
}

export default function DealCard({ deal, role }: DealCardProps) {
  const { acceptDeal, submitProof, approveRelease, dispute, refetchDeals } = useEscrow();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [proofUrl, setProofUrl] = useState('');

  const statusMap = [
    { label: 'Funded', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { label: 'In Progress', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { label: 'Reviewing', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { label: 'Disputed', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  ];

  const currentStatus = statusMap[deal.status] || statusMap[0];

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      setIsActionLoading(true);
      await actionFn();
      toast.success(successMsg);
      refetchDeals();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-neutral-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`${currentStatus.color} font-semibold px-3 py-1`}>
            {currentStatus.label}
          </Badge>
          <div className="text-right">
            <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Amount</p>
            <p className="text-xl font-bold text-neutral-900">{formatEther(deal.amount)} ARC</p>
          </div>
        </div>
        <CardTitle className="text-lg font-bold mt-2 line-clamp-2">{deal.description}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-neutral-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Created
            </p>
            <p className="font-medium">{format(new Date(Number(deal.createdAt) * 1000), 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-neutral-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Deadline
            </p>
            <p className="font-medium">{deal.deliveryDays.toString()} Days</p>
          </div>
        </div>

        {deal.status > 0 && (
          <div className="pt-2 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider mb-1">
              {role === 'buyer' ? 'Seller' : 'Buyer'} Address
            </p>
            <p className="text-xs font-mono text-neutral-600 truncate">
              {role === 'buyer' ? deal.seller : deal.buyer}
            </p>
          </div>
        )}

        {deal.status === 2 && deal.proofIpfs && (
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
            <p className="text-xs font-bold text-neutral-500 uppercase flex items-center mb-1">
              <FileText className="w-3 h-3 mr-1" /> Delivery Proof
            </p>
            <a 
              href={deal.proofIpfs} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center truncate"
            >
              {deal.proofIpfs} <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-neutral-50/50 border-t border-neutral-100 pt-4">
        {role === 'seller' && deal.status === 0 && (
          <Button 
            className="w-full bg-neutral-900" 
            onClick={() => handleAction(() => acceptDeal(deal.id), 'Deal accepted!')}
            disabled={isActionLoading}
          >
            {isActionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Accept Deal'}
          </Button>
        )}

        {role === 'seller' && deal.status === 1 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-neutral-900">Submit Proof</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Proof of Delivery</DialogTitle>
                <DialogDescription>
                  Provide an IPFS link or URL to your work. The buyer will review this before releasing funds.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="proof">Proof URL / IPFS Hash</Label>
                  <Input 
                    id="proof" 
                    placeholder="https://ipfs.io/ipfs/..." 
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={() => handleAction(() => submitProof(deal.id, proofUrl), 'Proof submitted!')}
                  disabled={isActionLoading || !proofUrl}
                >
                  {isActionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Submit for Review'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {role === 'buyer' && deal.status === 2 && (
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline" 
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => handleAction(() => dispute(deal.id, (Number(formatEther(deal.amount)) * 0.15).toString()), 'Dispute opened')}
              disabled={isActionLoading}
            >
              <AlertTriangle className="w-4 h-4 mr-2" /> Dispute
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleAction(() => approveRelease(deal.id), 'Funds released!')}
              disabled={isActionLoading}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
            </Button>
          </div>
        )}

        {deal.status === 3 && (
          <div className="w-full text-center py-2 text-emerald-600 font-medium text-sm flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Transaction Completed
          </div>
        )}

        {deal.status === 4 && (
          <div className="w-full text-center py-2 text-rose-600 font-medium text-sm flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 mr-2" /> Under Arbitration
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
