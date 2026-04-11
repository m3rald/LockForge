import { useReadContract } from 'wagmi'
import { LOCKFORGE_ADDRESS } from '../lib/contracts'
import { LOCKFORGE_ABI } from '../lib/abi'
import { useEffect, useState } from 'react'

export function useReviewWindow(dealId: number) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)

  const { data } = useReadContract({
    address: LOCKFORGE_ADDRESS as `0x${string}`,
    abi: LOCKFORGE_ABI,
    functionName: 'getReviewWindowStatus',
    args: [BigInt(dealId)],
    query: {
      refetchInterval: 10_000,
    }
  })

  useEffect(() => {
    if (data) {
      const [,, ,] = data as [bigint, bigint, boolean, boolean]
      setSecondsRemaining(Number(data[1]))
    }
  }, [data])

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return {
    reviewDeadline: data ? Number(data[0]) : 0,
    secondsRemaining,
    canDispute: data ? (data[2] as boolean) : false,
    canAutoRelease: data ? (data[3] as boolean) : false,
  }
}
