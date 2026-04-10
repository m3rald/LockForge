'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { LOCKFORGE_ADDRESS, lockForgeABI } from '../lib/contract';
import { toast } from 'sonner';

export function CreateDealForm() {
  const { address } = useAccount();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('7');
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !address) {
      if (!address) toast.error("Please connect your wallet first.");
      return;
    }

    setLoading(true);

    try {
      await writeContractAsync({
        address: LOCKFORGE_ADDRESS,
        abi: lockForgeABI,
        functionName: 'createDeal',
        args: [description, parseUnits(amount, 6), BigInt(days)],
        account: address,
      } as any);
      toast.success("Transaction sent! Check MetaMask.");
      setDescription('');
      setAmount('');
      setDays('7');
    } catch (error: any) {
      console.error(error);
      toast.error(error.shortMessage || error.message || "Failed to send transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Create New Deal</h2>
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what you want to buy..."
        className="w-full bg-black border border-zinc-700 rounded-2xl p-4 h-32 mb-6 focus:border-cyan-500 outline-none transition"
        required
      />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2 text-gray-400">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-2xl p-4 focus:border-cyan-500 outline-none transition"
            placeholder="1000"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-400">Delivery Days</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-2xl p-4 focus:border-cyan-500 outline-none transition"
            min="7"
            max="60"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl transition disabled:opacity-50"
      >
        {loading ? "Sending..." : "Lock USDC & Create Deal"}
      </button>
    </form>
  );
}
