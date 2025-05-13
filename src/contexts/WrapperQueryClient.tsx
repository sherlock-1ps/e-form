'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

export default function WrapperQueryClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()) // ✅ Create QueryClient

  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ Provide QueryClient */}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
