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

export function ClaimPaymentModal({ isOpen, onClose, deal }: { isOpen: boolean, onClose: () => void, deal: DealWithId }) {
  const { address } = useAccount()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()

  const { writeContractAsync } = useWriteContract()

  const handleClaim = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'claimAutoRelease',
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
      toast.success('Payment claimed successfully!')
      setTimeout(onClose, 2000)
    }
  }, [isConfirmed, onClose])

  const sellerPayout = deal.amount * 98n / 100n

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleClaim}
      title="Claim Auto-Release Payment"
      confirmText="Claim Payment"
      isLoading={txStatus === 'pending' || txStatus === 'approving'}
    >
      <div className="space-y-6">
        <p className="text-gray-400 leading-relaxed text-sm">
          The 24-hour review window has expired without a response from the buyer. You can now claim your payment.
        </p>

        <div className="bg-zinc-950 rounded-2xl p-6 text-center border border-zinc-800">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">You will receive</div>
          <div className="text-3xl font-black text-cyan-400">{displayAmount(sellerPayout)}</div>
        </div>

        <TxStatusBanner status={txStatus} txHash={txHash} error={txError} />
        <div className="flex justify-center">
          <GasCostNote />
        </div>
      </div>
    </ConfirmModal>
  )
}
