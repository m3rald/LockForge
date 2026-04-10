'use client';

import React from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { LOCKFORGE_ADDRESS, lockForgeABI } from '../lib/contract';
import { toast } from 'sonner';

export function DealList() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // In a real app, we would fetch the total number of deals or use getBuyerDeals
  // For this demo, we'll try to fetch the first few deals if they exist
  // This is a bit hacky without a 'dealCount' function, but let's assume we can fetch by ID
  
  const handleAccept = async (id: number) => {
    try {
      await writeContractAsync({
        address: LOCKFORGE_ADDRESS,
        abi: lockForgeABI,
        functionName: 'acceptDeal',
        args: [BigInt(id)],
        account: address,
      } as any);
      toast.success("Deal accepted!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.shortMessage || error.message || "Failed to accept deal.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Available Deals</h2>
      <div className="grid gap-4">
        {/* Placeholder for real data fetching logic */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">Logo Design Service</h3>
              <p className="text-sm text-gray-400">ID: #1</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-cyan-400">500 USDC</div>
              <p className="text-xs text-gray-500">14 Days Delivery</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Looking for a professional logo for a new DeFi project. Needs to be vector format.
          </p>
          <button 
            onClick={() => handleAccept(1)}
            className="w-full bg-zinc-800 hover:bg-cyan-500 hover:text-black transition py-3 rounded-xl font-bold"
          >
            Accept Deal
          </button>
        </div>
      </div>
    </div>
  );
}
