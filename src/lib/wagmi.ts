import { createConfig, http } from 'wagmi';

export const arcTestnet = {
  id: 999,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
  blockExplorers: { default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' } },
} as const;

export const config = createConfig({
  chains: [arcTestnet],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  transports: {
    [arcTestnet.id]: http(),
  },
});
