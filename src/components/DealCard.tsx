import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { formatUnits, parseUnits } from 'viem';
import { useEscrow } from '../hooks/useEscrow';
import { USDC_DECIMALS } from '../lib/abi';
import { ExternalLink, Clock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export interface Deal {
  id: bigint;
  buyer: string;
  seller: string;
  amount: bigint;
  description: string;
  deliveryDays: bigint;
  createdAt: bigint;
  acceptedAt: bigint;
  proofIpfs: string;
  status: number;
}

interface DealCardProps {
  deal: Deal;
  role: 'buyer' | 'seller';
}

const STATUS_MAP = ['Funded', 'In Progress', 'Reviewing', 'Completed', 'Disputed'];

export const DealCard: React.FC<DealCardProps> = ({ deal, role }) => {
  const { acceptDeal, submitProof, approveRelease, dispute } = useEscrow();
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await acceptDeal(Number(deal.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofUrl) return;
    setIsSubmitting(true);
    try {
      await submitProof(Number(deal.id), proofUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await approveRelease(Number(deal.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    setIsSubmitting(true);
    try {
      // 15% bond as per requirements
      const bond = (deal.amount * 15n) / 100n;
      await dispute(Number(deal.id), bond);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';

  return (
    <Card className="w-full overflow-hidden border-slate-200 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900">{deal.description}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px]">
                ID: {deal.id.toString()}
              </Badge>
              <Badge 
                variant={deal.status === 3 ? "default" : deal.status === 4 ? "destructive" : "secondary"}
                className="capitalize"
              >
                {STATUS_MAP[deal.status]}
              </Badge>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-indigo-600">{formatUnits(deal.amount, USDC_DECIMALS)} USDC</div>
            <div className="text-xs text-slate-500">Escrowed Amount</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-slate-500">Buyer</div>
            <div className="font-mono text-xs truncate" title={deal.buyer}>{deal.buyer}</div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-500">Seller</div>
            <div className="font-mono text-xs truncate" title={deal.seller}>
              {deal.seller === '0x0000000000000000000000000000000000000000' ? 'Unassigned' : deal.seller}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{deal.deliveryDays.toString()} Days Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Created {format(new Date(Number(deal.createdAt) * 1000), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {deal.proofIpfs && (
          <div className="rounded-lg bg-indigo-50 p-3 text-xs">
            <div className="mb-1 font-semibold text-indigo-900">Delivery Proof:</div>
            <a 
              href={deal.proofIpfs} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-600 hover:underline"
            >
              {deal.proofIpfs} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-slate-50/50 pt-4">
        <div className="flex w-full gap-2">
          {/* Seller Actions */}
          {isSeller && deal.status === 0 && (
            <Button className="w-full" onClick={handleAccept} disabled={isSubmitting}>
              Accept Deal
            </Button>
          )}
          
          {isSeller && deal.status === 1 && (
            <Dialog>
              <DialogTrigger render={<Button className="w-full" />}>
                Submit Proof
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Delivery Proof</DialogTitle>
                  <DialogDescription>
                    Provide an IPFS link or URL to your work for the buyer to review.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="proof">Proof URL (IPFS)</Label>
                    <Input 
                      id="proof" 
                      placeholder="https://ipfs.io/ipfs/..." 
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmitProof} disabled={isSubmitting || !proofUrl}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Buyer Actions */}
          {isBuyer && deal.status === 2 && (
            <>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isSubmitting}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Release
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDispute} disabled={isSubmitting}>
                <AlertCircle className="mr-2 h-4 w-4" /> Dispute
              </Button>
            </>
          )}

          {/* Status Indicators for non-actionable states */}
          {(deal.status === 3 || deal.status === 4) && (
            <div className="flex w-full items-center justify-center py-2 text-sm font-medium text-slate-500">
              {deal.status === 3 ? 'Transaction Completed' : 'Transaction in Dispute'}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
