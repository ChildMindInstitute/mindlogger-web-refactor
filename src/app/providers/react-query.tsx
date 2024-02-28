import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface ReactQueryProps {
  children: React.ReactNode;
}

function ReactQuery(props: ReactQueryProps) {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}

export default ReactQuery;
