import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { arcTestnet } from '../../lib/chain'
import { LOCKFORGE_ADDRESS } from '../../lib/contracts'
import { LOCKFORGE_ABI } from '../../lib/abi'
import { DealWithId } from '../../lib/types'
import { ConfirmModal } from '../shared/ConfirmModal'
import { TxStatusBanner, TxStatus } from '../shared/TxStatusBanner'
import { GasCostNote } from '../shared/GasCostNote'
import { toast } from 'sonner'

export function SubmitProofModal({ isOpen, onClose, deal }: { isOpen: boolean, onClose: () => void, deal: DealWithId }) {
  const { address } = useAccount()
  const [proof, setProof] = useState('')
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()

  const { writeContractAsync } = useWriteContract()

  const handleSubmit = async () => {
    if (!proof) return
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'submitProof',
        args: [BigInt(deal.id), proof],
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
      toast.success('Proof submitted! Review window started.')
      setTimeout(onClose, 2000)
    }
  }, [isConfirmed, onClose])

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title="Submit Delivery Proof"
      confirmText="Submit Proof"
      isLoading={txStatus === 'pending' || txStatus === 'approving'}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">Proof URL or IPFS CID</label>
          <input
            type="text"
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="Paste IPFS CID or delivery URL..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-cyan-500/50 outline-none"
          />
        </div>

        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 space-y-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            • After submitting, the buyer has 24 hours to approve or dispute.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            • If the buyer does nothing, you can claim payment after 24 hours.
          </p>
        </div>

        <TxStatusBanner status={txStatus} txHash={txHash} error={txError} />
        <div className="flex justify-center">
          <GasCostNote />
        </div>
      </div>
    </ConfirmModal>
  )
}
