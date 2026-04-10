'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      ) : (
        <button
          onClick={() => connect({ connector: injected() })}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl font-semibold"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
