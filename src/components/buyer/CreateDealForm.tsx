import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { arcTestnet } from '../../lib/chain'
import { LOCKFORGE_ADDRESS, USDC_ADDRESS } from '../../lib/contracts'
import { LOCKFORGE_ABI, USDC_ABI } from '../../lib/abi'
import { toUsdc6, displayAmount, GAS_ESTIMATE_USDC6 } from '../../lib/utils'
import { FeeBreakdownPanel } from '../shared/FeeBreakdownPanel'
import { TxStatusBanner, TxStatus } from '../shared/TxStatusBanner'
import { GasCostNote } from '../shared/GasCostNote'
import { useUsdcBalance } from '../../hooks/useUsdcBalance'
import { toast } from 'sonner'

export function CreateDealForm() {
  const { address } = useAccount()
  const { data: balance } = useUsdcBalance()
  
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [days, setDays] = useState(14)
  const [agreed, setAgreed] = useState(false)
  
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()
  const [step, setStep] = useState(1) // 1: Approve, 2: Create

  const { writeContractAsync } = useWriteContract()

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, LOCKFORGE_ADDRESS as `0x${string}`] : undefined,
  })

  const amountBigInt = amount ? toUsdc6(amount) : 0n
  const needsApproval = allowance !== undefined && (allowance as bigint) < amountBigInt

  useEffect(() => {
    if (!needsApproval && step === 1 && amountBigInt > 0n) {
      setStep(2)
    }
  }, [needsApproval, step, amountBigInt])

  const handleApprove = async () => {
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [LOCKFORGE_ADDRESS as `0x${string}`, amountBigInt],
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

  const handleCreate = async () => {
    if (!agreed) {
      toast.error('Please agree to the terms')
      return
    }
    
    setTxStatus('approving')
    setTxError(undefined)
    try {
      const hash = await writeContractAsync({
        address: LOCKFORGE_ADDRESS as `0x${string}`,
        abi: LOCKFORGE_ABI,
        functionName: 'createDeal',
        args: [description, amountBigInt, BigInt(days)],
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

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  })

  useEffect(() => {
    if (isConfirmed) {
      setTxStatus('success')
      if (step === 1) {
        refetchAllowance()
        setStep(2)
      } else {
        toast.success('Deal created successfully!')
        setDescription('')
        setAmount('')
        setDays(14)
        setAgreed(false)
        setStep(1)
      }
    }
  }, [isConfirmed, step, refetchAllowance])

  const canSubmit = description.length > 0 && 
                    amountBigInt >= 1_000_000n && 
                    days >= 7 && days <= 60 &&
                    balance !== undefined && (balance as bigint) >= (amountBigInt + 20_000n)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">Create New Escrow Deal</h2>
        <p className="text-gray-400 text-sm">Define terms and lock USDC to start a new deal.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the work, deliverables, and expectations..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all min-h-[120px]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">USDC Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">USDC</div>
            </div>
            {amount && <div className="text-xs text-gray-500 font-medium">≈ ${amount} USD</div>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 flex justify-between">
              Delivery Deadline
              <span className="text-cyan-400">{days} Days</span>
            </label>
            <input
              type="range"
              min="7"
              max="60"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-wider">
              <span>7 Days</span>
              <span>60 Days</span>
            </div>
          </div>
        </div>

        <FeeBreakdownPanel amount={amountBigInt} />

        <div className="flex items-start gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-2xl">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 size-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="agree" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
            I understand my USDC will be locked in the smart contract until the deal is completed, cancelled, or resolved. A 2% platform fee applies on release.
          </label>
        </div>

        <TxStatusBanner status={txStatus} txHash={txHash} error={txError} />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-zinc-800'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-zinc-800'}`} />
          </div>
          
          {step === 1 ? (
            <button
              onClick={handleApprove}
              disabled={!canSubmit || txStatus === 'pending' || txStatus === 'approving'}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 disabled:text-gray-500 text-black font-black text-xl py-5 rounded-2xl transition-all active:scale-95"
            >
              Step 1: Approve USDC
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!canSubmit || !agreed || txStatus === 'pending' || txStatus === 'approving'}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 disabled:text-gray-500 text-black font-black text-xl py-5 rounded-2xl transition-all active:scale-95"
            >
              Step 2: Create Deal
            </button>
          )}
          
          <div className="flex justify-center">
            <GasCostNote />
          </div>
        </div>
      </div>
    </div>
  )
}
