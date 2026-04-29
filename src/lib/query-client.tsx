'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Configuração do QueryClient com opções otimizadas para o Garage Ninja
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache de 5 minutos para dados estáticos
        staleTime: 5 * 60 * 1000,
        // Retry 2 vezes em caso de falha
        retry: 2,
        // Não refetchar em window focus para melhor performance
        refetchOnWindowFocus: false,
        // Background refetch a cada 2 minutos para dados dinâmicos
        refetchInterval: 2 * 60 * 1000,
      },
      mutations: {
        // Retry mutations em caso de falha de rede
        retry: 1,
      },
    },
  })
}

let clientQueryClientSingleton: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: sempre criar novo client para evitar cache entre requisições
    return createQueryClient()
  } else {
    // Browser: usar singleton para manter cache entre navegações
    if (!clientQueryClientSingleton) {
      clientQueryClientSingleton = createQueryClient()
    }
    return clientQueryClientSingleton
  }
}

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

// Export para uso em hooks e componentes
export { getQueryClient }
