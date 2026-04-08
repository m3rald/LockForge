import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { ESCROW_ABI, CONTRACT_ADDRESS } from '../lib/abi';
import { toast } from 'sonner';

export function useEscrow() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: deals, refetch: refetchDeals, isLoading: isLoadingDeals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'getDeals',
  });

  const createDeal = async (description: string, amount: bigint, deliveryDays: number) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createDeal',
        args: [description, amount, BigInt(deliveryDays)],
        value: amount,
        account: address,
      } as any);
      toast.success('Deal created successfully!');
      refetchDeals();
      return tx;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create deal');
      throw error;
    }
  };

  const acceptDeal = async (dealId: number) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'acceptDeal',
        args: [BigInt(dealId)],
        account: address,
      } as any);
      toast.success('Deal accepted!');
      refetchDeals();
      return tx;
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept deal');
      throw error;
    }
  };

  const submitProof = async (dealId: number, proofIpfs: string) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'submitProof',
        args: [BigInt(dealId), proofIpfs],
        account: address,
      } as any);
      toast.success('Proof submitted!');
      refetchDeals();
      return tx;
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit proof');
      throw error;
    }
  };

  const approveRelease = async (dealId: number) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'approveRelease',
        args: [BigInt(dealId)],
        account: address,
      } as any);
      toast.success('Funds released successfully!');
      refetchDeals();
      return tx;
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve release');
      throw error;
    }
  };

  const dispute = async (dealId: number, bondAmount: bigint) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'dispute',
        args: [BigInt(dealId)],
        value: bondAmount,
        account: address,
      } as any);
      toast.success('Dispute opened successfully!');
      refetchDeals();
      return tx;
    } catch (error: any) {
      toast.error(error.message || 'Failed to open dispute');
      throw error;
    }
  };

  return {
    deals,
    isLoadingDeals,
    refetchDeals,
    createDeal,
    acceptDeal,
    submitProof,
    approveRelease,
    dispute,
  };
}
