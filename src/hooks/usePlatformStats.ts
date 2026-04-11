import { useReadContract } from 'wagmi'
import { LOCKFORGE_ADDRESS } from '../lib/contracts'
import { LOCKFORGE_ABI } from '../lib/abi'

export function usePlatformStats() {
  return useReadContract({
    address: LOCKFORGE_ADDRESS as `0x${string}`,
    abi: LOCKFORGE_ABI,
    functionName: 'getPlatformStats',
    query: {
      refetchInterval: 30_000,
    }
  })
}
