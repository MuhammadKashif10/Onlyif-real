'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PropertyProvider } from '../context/PropertyContext';
import { BuyerProvider } from '../context/BuyerContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  }));

  return (
    <AuthProvider>
      <PropertyProvider>
        <BuyerProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BuyerProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}