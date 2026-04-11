import { useReadContract, useAccount } from 'wagmi'
import { LOCKFORGE_ADDRESS } from '../lib/contracts'
import { LOCKFORGE_ABI } from '../lib/abi'
import { DealWithId, Deal } from '../lib/types'
import { useEffect, useState } from 'react'

export function useBuyerDeals() {
  const { address } = useAccount()
  const [deals, setDeals] = useState<DealWithId[]>([])

  const { data: dealIds, refetch: refetchIds } = useReadContract({
    address: LOCKFORGE_ADDRESS as `0x${string}`,
    abi: LOCKFORGE_ABI,
    functionName: 'getBuyerDeals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15_000,
    }
  })

  const { data: batchDeals, refetch: refetchBatch } = useReadContract({
    address: LOCKFORGE_ADDRESS as `0x${string}`,
    abi: LOCKFORGE_ABI,
    functionName: 'getBatchDeals',
    args: dealIds && dealIds.length > 0 ? [dealIds as readonly bigint[]] : undefined,
    query: {
      enabled: !!dealIds && dealIds.length > 0,
      refetchInterval: 15_000,
    }
  })

  useEffect(() => {
    if (dealIds && batchDeals) {
      const combined = (dealIds as bigint[]).map((id, index) => ({
        id: Number(id),
        ...(batchDeals as Deal[])[index]
      }))
      setDeals(combined)
    } else {
      setDeals([])
    }
  }, [dealIds, batchDeals])

  return { deals, refetch: () => { refetchIds(); refetchBatch(); } }
}
