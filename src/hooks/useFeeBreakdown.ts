import { useReadContract } from 'wagmi'
import { LOCKFORGE_ADDRESS } from '../lib/contracts'
import { LOCKFORGE_ABI } from '../lib/abi'

export function useFeeBreakdown(amount: bigint) {
  return useReadContract({
    address: LOCKFORGE_ADDRESS as `0x${string}`,
    abi: LOCKFORGE_ABI,
    functionName: 'getFeeBreakdown',
    args: amount >= 1_000_000n ? [amount] : undefined,
    query: {
      enabled: amount >= 1_000_000n,
    }
  })
}
