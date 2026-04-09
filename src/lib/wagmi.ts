import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

export const arcTestnet = defineChain({
  id: 666, // Placeholder ID for Arc Testnet, replace with actual if known
  name: 'Arc Testnet',
  nativeCurrency: { name: 'Arc', symbol: 'ARC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://explorer.testnet.arc.network' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [arcTestnet, mainnet, sepolia],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  transports: {
    [arcTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
