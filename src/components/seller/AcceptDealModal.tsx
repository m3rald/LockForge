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

export function AcceptDealModal({ isOpen, onClose, deal }: { isOpen: boolean, onClose: () => void, deal: DealWithId }) {
  const { address } = useAccount()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()

  const { writeContractAsync } = useWriteContract()

  const handleAccept = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'acceptDeal',
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
      toast.success('Deal accepted! Delivery clock started.')
      setTimeout(onClose, 2000)
    }
  }, [isConfirmed, onClose])

  const sellerPayout = deal.amount * 98n / 100n

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleAccept}
      title={`Accept Deal #${deal.id}?`}
      confirmText="Accept Deal"
      isLoading={txStatus === 'pending' || txStatus === 'approving'}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-400 leading-relaxed text-sm">
            By accepting, you agree to deliver the work within <span className="text-white font-bold">{Number(deal.deliveryDays)} days</span>.
          </p>
          <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
            <li>You will receive <span className="text-cyan-400 font-bold">{displayAmount(sellerPayout)}</span> after the 2% platform fee.</li>
            <li>No counter-offers are possible — you accept the exact terms shown.</li>
            <li>Failure to deliver on time may allow the buyer to cancel.</li>
          </ul>
        </div>

        <TxStatusBanner status={txStatus} txHash={txHash} error={txError} />
        <div className="flex justify-center">
          <GasCostNote />
        </div>
      </div>
    </ConfirmModal>
  )
}
