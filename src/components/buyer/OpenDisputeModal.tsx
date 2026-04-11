import React, { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi'
import { arcTestnet } from '../../lib/chain'
import { LOCKFORGE_ADDRESS, USDC_ADDRESS } from '../../lib/contracts'
import { LOCKFORGE_ABI, USDC_ABI } from '../../lib/abi'
import { DealWithId } from '../../lib/types'
import { displayAmount } from '../../lib/utils'
import { ConfirmModal } from '../shared/ConfirmModal'
import { TxStatusBanner, TxStatus } from '../shared/TxStatusBanner'
import { GasCostNote } from '../shared/GasCostNote'
import { useUsdcBalance } from '../../hooks/useUsdcBalance'
import { toast } from 'sonner'

export function OpenDisputeModal({ isOpen, onClose, deal }: { isOpen: boolean, onClose: () => void, deal: DealWithId }) {
  const { address } = useAccount()
  const { data: balance } = useUsdcBalance()
  
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()
  const [step, setStep] = useState(1)

  const { writeContractAsync } = useWriteContract()

  const bondAmount = deal.amount * 15n / 100n

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, LOCKFORGE_ADDRESS as `0x${string}`] : undefined,
  })

  const needsApproval = allowance !== undefined && (allowance as bigint) < bondAmount

  useEffect(() => {
    if (!needsApproval && step === 1) {
      setStep(2)
    }
  }, [needsApproval, step])

  const handleApprove = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [LOCKFORGE_ADDRESS as `0x${string}`, bondAmount],
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

  const handleDispute = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'openDispute',
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
      if (step === 1) {
        refetchAllowance()
        setStep(2)
      } else {
        toast.success('Dispute opened successfully')
        setTimeout(onClose, 2000)
      }
    }
  }, [isConfirmed, step, refetchAllowance, onClose])

  const hasBalance = balance !== undefined && (balance as bigint) >= (bondAmount + 10_000n)

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={step === 1 ? handleApprove : handleDispute}
      title="Open Dispute"
      confirmText={step === 1 ? "Approve Bond" : "Confirm Dispute"}
      confirmVariant="danger"
      isLoading={txStatus === 'pending' || txStatus === 'approving'}
    >
      <div className="space-y-6">
        <p className="text-gray-400 leading-relaxed text-sm">
          Opening a dispute requires a 15% bond. This bond is returned if you win the dispute, but forfeited if the seller wins or if it auto-resolves.
        </p>

        <div className="bg-zinc-950 rounded-2xl p-6 space-y-3 border border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deal amount</span>
            <span className="font-bold text-gray-200">{displayAmount(deal.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Your bond (15%)</span>
            <span className="font-bold text-red-400">{displayAmount(bondAmount)}</span>
          </div>
        </div>

        {!hasBalance && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold">
            Insufficient USDC for bond + gas
          </div>
        )}

        <TxStatusBanner status={txStatus} txHash={txHash} error={txError} />
        <div className="flex justify-center">
          <GasCostNote />
        </div>
      </div>
    </ConfirmModal>
  )
}
