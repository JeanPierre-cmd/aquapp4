import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';
import { GlobalErrorBoundary } from './error-boundary';

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        {children}
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
