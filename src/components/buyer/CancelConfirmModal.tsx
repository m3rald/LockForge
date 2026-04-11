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

export function CancelConfirmModal({ isOpen, onClose, deal }: { isOpen: boolean, onClose: () => void, deal: DealWithId }) {
  const { address } = useAccount()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()

  const { writeContractAsync } = useWriteContract()

  const handleCancel = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'claimRefund',
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
      toast.success('Deal cancelled successfully')
      setTimeout(onClose, 2000)
    }
  }, [isConfirmed, onClose])

  const cancelFee = deal.amount * 3n / 100n
  const refundAmount = deal.amount - cancelFee

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleCancel}
      title={`Cancel Deal #${deal.id}`}
      confirmText="Cancel Deal"
      confirmVariant="danger"
      isLoading={txStatus === 'pending' || txStatus === 'approving'}
    >
      <div className="space-y-6">
        <p className="text-gray-400 leading-relaxed">
          Are you sure you want to cancel this deal? Since it hasn't been accepted by a seller yet, you can claim a refund minus the cancellation fee.
        </p>

        <div className="bg-zinc-950 rounded-2xl p-6 space-y-3 border border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deal amount</span>
            <span className="font-bold text-gray-200">{displayAmount(deal.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Cancel fee (3%)</span>
            <span className="font-bold text-red-400">- {displayAmount(cancelFee)}</span>
          </div>
          <div className="h-px bg-zinc-800 my-2" />
          <div className="flex justify-between text-lg">
            <span className="font-bold text-gray-300">You receive back</span>
            <span className="font-black text-cyan-400">{displayAmount(refundAmount)}</span>
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
