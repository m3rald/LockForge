import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { ESCROW_ABI, CONTRACT_ADDRESS } from '../lib/abi';
import { parseEther } from 'viem';

export function useEscrow() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const createDeal = async (description: string, amount: string, deliveryDays: number) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'createDeal',
      args: [description, parseEther(amount), BigInt(deliveryDays)],
      value: parseEther(amount),
      account: address,
    } as any);
  };

  const acceptDeal = async (dealId: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'acceptDeal',
      args: [dealId],
      account: address,
    } as any);
  };

  const submitProof = async (dealId: bigint, proofIpfs: string) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'submitProof',
      args: [dealId, proofIpfs],
      account: address,
    } as any);
  };

  const approveRelease = async (dealId: bigint) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'approveRelease',
      args: [dealId],
      account: address,
    } as any);
  };

  const dispute = async (dealId: bigint, bondAmount: string) => {
    return writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'dispute',
      args: [dealId],
      value: parseEther(bondAmount),
      account: address,
    } as any);
  };

  const { data: deals, isLoading: isLoadingDeals, refetch: refetchDeals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'getDeals',
  });

  return {
    createDeal,
    acceptDeal,
    submitProof,
    approveRelease,
    dispute,
    deals,
    isLoadingDeals,
    refetchDeals,
    address,
  };
}
