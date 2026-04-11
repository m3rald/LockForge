import React, { useState } from 'react'
import { DealWithId, DealStatus } from '../../lib/types'
import { displayAmount, shortAddress, explorerAddress } from '../../lib/utils'
import { StatusBadge } from '../shared/StatusBadge'
import { CountdownTimer } from '../shared/CountdownTimer'
import { useDeliveryWindow } from '../../hooks/useDeliveryWindow'
import { useReviewWindow } from '../../hooks/useReviewWindow'
import { useDisputeWindow } from '../../hooks/useDisputeWindow'
import { ExternalLink, Clock, User, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react'
import { SubmitProofModal } from './SubmitProofModal'
import { ClaimPaymentModal } from './ClaimPaymentModal'

export function SellerDealCard({ deal }: { deal: DealWithId }) {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isClaimOpen, setIsClaimOpen] = useState(false)

  const delivery = useDeliveryWindow(deal.id)
  const review = useReviewWindow(deal.id)
  const dispute = useDisputeWindow(deal.id)

  const isInProgress = deal.status === DealStatus.Accepted
  const isReviewing = deal.status === DealStatus.ProofSubmitted
  const isDisputed = deal.status === DealStatus.Disputed
  const isCompleted = deal.status === DealStatus.Completed
  const isCancelled = deal.status === DealStatus.Cancelled
  const isRefunded = deal.status === DealStatus.Refunded

  const sellerPayout = deal.amount * 98n / 100n

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 hover:border-zinc-700 transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">Deal #{deal.id}</h3>
            <StatusBadge status={deal.status} />
          </div>
          <p className="text-xs text-gray-500">Accepted {new Date(Number(deal.acceptedAt) * 1000).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-cyan-400">{displayAmount(sellerPayout)}</div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Payout</div>
        </div>
      </div>

      <div className="bg-zinc-950/50 rounded-2xl p-4">
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
          {deal.descriptionIPFS}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <User className="size-4" />
          <span>Buyer:</span>
          <a href={explorerAddress(deal.buyer)} target="_blank" className="text-cyan-500 hover:underline font-mono">
            {shortAddress(deal.buyer)}
          </a>
        </div>
        
        {isInProgress && (
          <div className="flex items-center gap-2 text-gray-400 justify-end">
            <Clock className="size-4" />
            <span>Deadline:</span>
            <CountdownTimer seconds={delivery.secondsRemaining} />
          </div>
        )}

        {isReviewing && (
          <div className="flex items-center gap-2 text-gray-400 justify-end">
            <Clock className="size-4" />
            <span>Review ends:</span>
            <CountdownTimer seconds={review.secondsRemaining} />
          </div>
        )}

        {isDisputed && (
          <div className="flex items-center gap-2 text-gray-400 justify-end">
            <ShieldAlert className="size-4" />
            <span>Resolution:</span>
            <CountdownTimer seconds={dispute.secondsRemaining} />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-800 flex flex-wrap gap-3">
        {isInProgress && (
          <>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all text-sm font-bold"
            >
              Submit Proof
            </button>
            {delivery.isOverdue && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <AlertTriangle className="size-4" />
                Deadline passed — buyer may cancel
              </div>
            )}
          </>
        )}

        {isReviewing && (
          <>
            <div className="flex-1 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-xs text-gray-400 italic">
              Awaiting buyer review or auto-release...
            </div>
            {review.canAutoRelease && (
              <button
                onClick={() => setIsClaimOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-green-500 text-black hover:bg-green-400 transition-all text-sm font-bold"
              >
                Claim Payment
              </button>
            )}
          </>
        )}

        {isDisputed && dispute.canAutoResolve && (
          <button
            onClick={() => {/* Resolve logic */}}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all text-sm font-bold"
          >
            Trigger Auto-Resolution
          </button>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
            <CheckCircle2 className="size-4" />
            Payment received: {displayAmount(sellerPayout)}
          </div>
        )}
      </div>

      <SubmitProofModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        deal={deal}
      />
      <ClaimPaymentModal
        isOpen={isClaimOpen}
        onClose={() => setIsClaimOpen(false)}
        deal={deal}
      />
    </div>
  )
}
