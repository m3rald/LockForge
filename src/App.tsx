/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { wagmiConfig } from './lib/wagmi';
import { Toaster } from 'sonner';
import { NetworkGuard } from './components/layout/NetworkGuard';
import { RoleGuard } from './components/layout/RoleGuard';

// Pages
import Landing from './pages/Landing';
import SelectRole from './pages/SelectRole';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <NetworkGuard>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route 
                path="/buyer" 
                element={
                  <RoleGuard requiredRole="buyer">
                    <BuyerDashboard />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/seller" 
                element={
                  <RoleGuard requiredRole="seller">
                    <SellerDashboard />
                  </RoleGuard>
                } 
              />
            </Routes>
          </NetworkGuard>
        </Router>
        <Toaster position="top-center" richColors theme="dark" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
