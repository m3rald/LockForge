import { useWriteContract, useReadContract, useAccount, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { ESCROW_ABI, CONTRACT_ADDRESS, USDC_ADDRESS, ERC20_ABI } from '../lib/abi';
import { toast } from 'sonner';

export function useEscrow() {
  const { address } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  const { data: deals, refetch: refetchDeals, isLoading: isLoadingDeals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'getDeals',
  });

  const createDeal = async (description: string, amount: bigint, deliveryDays: number) => {
    const toastId = toast.loading('Initializing transaction...');
    try {
      // If USDC_ADDRESS is set, handle ERC20 flow
      if (USDC_ADDRESS) {
        toast.loading('Approving USDC...', { id: toastId });
        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, amount],
          account: address,
        } as any);
        await waitForTransactionReceipt(config, { hash: approveHash });
      }

      toast.loading('Creating deal on-chain...', { id: toastId });
      
      // Log arguments for debugging
      console.log('Creating Deal with:', {
        description,
        amount: amount.toString(),
        deliveryDays,
        value: USDC_ADDRESS ? '0' : amount.toString()
      });

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createDeal',
        args: [description, amount, BigInt(deliveryDays)],
        // Only send value if not using ERC20
        value: USDC_ADDRESS ? BigInt(0) : amount,
        account: address,
      } as any);
      
      toast.loading('Waiting for confirmation...', { id: toastId });
      
      const receipt = await waitForTransactionReceipt(config, { hash });
      
      if (receipt.status === 'success') {
        toast.success('Deal created successfully!', { id: toastId });
        refetchDeals();
        return hash;
      } else {
        throw new Error('Transaction reverted on-chain. Check if you have enough balance or if the contract logic allows this operation.');
      }
    } catch (error: any) {
      console.error('LockForge Transaction Error:', error);
      const errorMessage = error.shortMessage || error.details || error.message || 'Transaction failed';
      toast.error(errorMessage, { id: toastId });
      throw error;
    }
  };

  const acceptDeal = async (dealId: number) => {
    const toastId = toast.loading('Accepting deal...');
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'acceptDeal',
        args: [BigInt(dealId)],
        account: address,
      } as any);
      
      toast.loading('Waiting for confirmation...', { id: toastId });
      const receipt = await waitForTransactionReceipt(config, { hash });
      
      if (receipt.status === 'success') {
        toast.success('Deal accepted!', { id: toastId });
        refetchDeals();
        return hash;
      } else {
        throw new Error('Transaction reverted on-chain');
      }
    } catch (error: any) {
      console.error('LockForge Transaction Error:', error);
      const errorMessage = error.shortMessage || error.details || error.message || 'Transaction failed';
      toast.error(errorMessage, { id: toastId });
      throw error;
    }
  };

  const submitProof = async (dealId: number, proofIpfs: string) => {
    const toastId = toast.loading('Submitting proof...');
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'submitProof',
        args: [BigInt(dealId), proofIpfs],
        account: address,
      } as any);
      
      toast.loading('Waiting for confirmation...', { id: toastId });
      const receipt = await waitForTransactionReceipt(config, { hash });
      
      if (receipt.status === 'success') {
        toast.success('Proof submitted!', { id: toastId });
        refetchDeals();
        return hash;
      } else {
        throw new Error('Transaction reverted on-chain');
      }
    } catch (error: any) {
      console.error('LockForge Transaction Error:', error);
      const errorMessage = error.shortMessage || error.details || error.message || 'Transaction failed';
      toast.error(errorMessage, { id: toastId });
      throw error;
    }
  };

  const approveRelease = async (dealId: number) => {
    const toastId = toast.loading('Releasing funds...');
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'approveRelease',
        args: [BigInt(dealId)],
        account: address,
      } as any);
      
      toast.loading('Waiting for confirmation...', { id: toastId });
      const receipt = await waitForTransactionReceipt(config, { hash });
      
      if (receipt.status === 'success') {
        toast.success('Funds released successfully!', { id: toastId });
        refetchDeals();
        return hash;
      } else {
        throw new Error('Transaction reverted on-chain');
      }
    } catch (error: any) {
      console.error('LockForge Transaction Error:', error);
      const errorMessage = error.shortMessage || error.details || error.message || 'Transaction failed';
      toast.error(errorMessage, { id: toastId });
      throw error;
    }
  };

  const dispute = async (dealId: number, bondAmount: bigint) => {
    const toastId = toast.loading('Opening dispute...');
    try {
      if (USDC_ADDRESS) {
        toast.loading('Approving USDC for bond...', { id: toastId });
        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, bondAmount],
          account: address,
        } as any);
        await waitForTransactionReceipt(config, { hash: approveHash });
      }

      toast.loading('Submitting dispute...', { id: toastId });
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'dispute',
        args: [BigInt(dealId)],
        value: USDC_ADDRESS ? BigInt(0) : bondAmount,
        account: address,
      } as any);
      
      toast.loading('Waiting for confirmation...', { id: toastId });
      const receipt = await waitForTransactionReceipt(config, { hash });
      
      if (receipt.status === 'success') {
        toast.success('Dispute opened successfully!', { id: toastId });
        refetchDeals();
        return hash;
      } else {
        throw new Error('Transaction reverted on-chain');
      }
    } catch (error: any) {
      console.error('LockForge Transaction Error:', error);
      const errorMessage = error.shortMessage || error.details || error.message || 'Transaction failed';
      toast.error(errorMessage, { id: toastId });
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
