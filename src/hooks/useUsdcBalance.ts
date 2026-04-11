import { useReadContract, useAccount } from 'wagmi'
import { USDC_ADDRESS } from '../lib/contracts'
import { USDC_ABI } from '../lib/abi'

export function useUsdcBalance() {
  const { address } = useAccount()
  return useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10_000,
    }
  })
}
