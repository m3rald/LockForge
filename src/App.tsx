/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmi';
import { Toaster } from '@/components/ui/sonner';
import LockForgeApp from './components/LockForgeApp';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LockForgeApp />
        <Toaster />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
