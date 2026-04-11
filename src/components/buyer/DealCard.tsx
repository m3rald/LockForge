import React, { useState } from 'react'
import { DealWithId, DealStatus } from '../../lib/types'
import { displayAmount, shortAddress, explorerAddress } from '../../lib/utils'
import { StatusBadge } from '../shared/StatusBadge'
import { CountdownTimer } from '../shared/CountdownTimer'
import { useDeliveryWindow } from '../../hooks/useDeliveryWindow'
import { useReviewWindow } from '../../hooks/useReviewWindow'
import { useDisputeWindow } from '../../hooks/useDisputeWindow'
import { ExternalLink, Clock, User, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import { CancelConfirmModal } from './CancelConfirmModal'
import { ApproveReleaseModal } from './ApproveReleaseModal'
import { OpenDisputeModal } from './OpenDisputeModal'

export function DealCard({ deal }: { deal: DealWithId }) {
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isDisputeOpen, setIsDisputeOpen] = useState(false)

  const delivery = useDeliveryWindow(deal.id)
  const review = useReviewWindow(deal.id)
  const dispute = useDisputeWindow(deal.id)

  const isAwaitingSeller = deal.status === DealStatus.Funded
  const isInProgress = deal.status === DealStatus.Accepted
  const isReviewing = deal.status === DealStatus.ProofSubmitted
  const isDisputed = deal.status === DealStatus.Disputed
  const isCompleted = deal.status === DealStatus.Completed
  const isCancelled = deal.status === DealStatus.Cancelled
  const isRefunded = deal.status === DealStatus.Refunded

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 hover:border-zinc-700 transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">Deal #{deal.id}</h3>
            <StatusBadge status={deal.status} />
          </div>
          <p className="text-xs text-gray-500">Created {new Date(Number(deal.createdAt) * 1000).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-cyan-400">{displayAmount(deal.amount)}</div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Escrow</div>
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
          <span>Seller:</span>
          {deal.seller === '0x0000000000000000000000000000000000000000' ? (
            <span className="text-gray-600 italic">Awaiting acceptance</span>
          ) : (
            <a href={explorerAddress(deal.seller)} target="_blank" className="text-cyan-500 hover:underline font-mono">
              {shortAddress(deal.seller)}
            </a>
          )}
        </div>
        
        {isInProgress && (
          <div className="flex items-center gap-2 text-gray-400 justify-end">
            <Clock className="size-4" />
            <span>Delivery:</span>
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
        {isAwaitingSeller && (
          <button
            onClick={() => setIsCancelOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold"
          >
            Cancel Deal
          </button>
        )}

        {isReviewing && (
          <>
            <a
              href={deal.proofIPFS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-all text-sm font-bold"
            >
              View Proof
              <ExternalLink className="size-4" />
            </a>
            {review.canDispute && (
              <>
                <button
                  onClick={() => setIsApproveOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all text-sm font-bold"
                >
                  Approve Release
                </button>
                <button
                  onClick={() => setIsDisputeOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold"
                >
                  Open Dispute
                </button>
              </>
            )}
          </>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
            <CheckCircle2 className="size-4" />
            Funds released to seller
          </div>
        )}

        {isCancelled && (
          <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
            <XCircle className="size-4" />
            Deal cancelled & refunded
          </div>
        )}

        {isRefunded && (
          <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
            <ShieldAlert className="size-4" />
            Dispute won — Refunded
          </div>
        )}
      </div>

      <CancelConfirmModal 
        isOpen={isCancelOpen} 
        onClose={() => setIsCancelOpen(false)} 
        deal={deal} 
      />
      <ApproveReleaseModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        deal={deal}
      />
      <OpenDisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        deal={deal}
      />
    </div>
  )
}
