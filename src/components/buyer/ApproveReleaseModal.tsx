import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { arcTestnet } from '../../lib/chain'
import { LOCKFORGE_ADDRESS } from '../../lib/contracts'
import { LOCKFORGE_ABI } from '../../lib/abi'
import { DealWithId } from '../../lib/types'
import { displayAmount } from '../../lib/utils'
import { ConfirmModal } from '../shared/ConfirmModal'
import { TxStatusBanner, TxStatus } from '../shared/TxStatusBanner'
import { GasCostNote } from '../shared/GasCostNote'
import { toast } from 'sonner'

export function ApproveReleaseModal({ isOpen, onClose, deal }: { isOpen: boolean, onClose: () => void, deal: DealWithId }) {
  const { address } = useAccount()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()

  const { writeContractAsync } = useWriteContract()

  const handleApprove = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'approveRelease',
        args: [BigInt(deal.id)],
        account: address,
        chain: arcTestnet,
      })
      setTxHash(hash)
      setTxStatus('pending')
    } catch (err: any) {
      setTxStatus('error')
      setTxError(err.shortMessage || err.message)
    }
  }

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  })

  useEffect(() => {
    if (isConfirmed) {
      setTxStatus('success')
      toast.success('Payment released to seller')
      setTimeout(onClose, 2000)
    }
  }, [isConfirmed, onClose])

  const platformFee = deal.amount * 2n / 100n
  const sellerPayout = deal.amount - platformFee

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleApprove}
      title="Approve & Release Payment"
      confirmText="Confirm Release"
      isLoading={txStatus === 'pending' || txStatus === 'approving'}
    >
      <div className="space-y-6">
        <p className="text-gray-400 leading-relaxed">
          By approving, you confirm that the work has been delivered as expected. The locked funds will be released to the seller immediately.
        </p>

        <div className="bg-zinc-950 rounded-2xl p-6 space-y-3 border border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Seller receives</span>
            <span className="font-bold text-cyan-400">{displayAmount(sellerPayout)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Platform fee (2%)</span>
            <span className="font-bold text-gray-200">{displayAmount(platformFee)}</span>
          </div>
        </div>

        <TxStatusBanner status={txStatus} txHash={txHash} error={txError} />
        <div className="flex justify-center">
          <GasCostNote />
        </div>
      </div>
    </ConfirmModal>
  )
}
