/**
 * Lazy Components - Componentes com lazy loading para otimizar performance
 * Carrega componentes apenas quando necessários
 */

import { lazy, Suspense } from 'react'
import { Loading } from '@/components/ui/loading'
import { ComponentProps } from 'react'
import { PredictiveInsight, MaintenanceLogSummary } from '@/types'

// Lazy loading para componentes pesados
export const LazyExpenseChart = lazy(() => 
  import('@/components/expense-chart').then(module => ({ 
    default: module.ExpenseChart 
  }))
)

export const LazyAchievements = lazy(() => 
  import('@/components/achievements').then(module => ({ 
    default: module.Achievements 
  }))
)

export const LazyMaintenanceForecast = lazy(() => 
  import('@/components/dashboard').then(module => ({ 
    default: module.MaintenanceForecast 
  }))
)

export const LazyCostAnalysis = lazy(() => 
  import('@/components/dashboard').then(module => ({ 
    default: module.CostAnalysis 
  }))
)

export const LazySmartAlerts = lazy(() => 
  import('@/components/dashboard').then(module => ({ 
    default: module.SmartAlerts 
  }))
)

// Tipos para os props dos componentes
interface ExpenseChartProps {
  maintenanceLogs?: MaintenanceLogSummary[]
}

interface AchievementsProps {
  achievements?: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlockedAt?: Date
  }>
}

interface MaintenanceForecastProps {
  insights: PredictiveInsight[]
  nextMaintenanceDate: Date | null
}

interface CostAnalysisProps {
  expenses?: Array<{
    id: string
    amount: number
    category: string
    date: Date
    description: string
  }>
}

interface SmartAlertsProps {
  alerts?: Array<{
    id: string
    type: 'warning' | 'error' | 'info' | 'success'
    title: string
    message: string
    timestamp: Date
  }>
}

// Wrapper com Suspense para lazy components
export function LazyExpenseChartWrapper(props: ExpenseChartProps) {
  return (
    <Suspense fallback={<Loading message="Carregando gráfico..." />}>
      <LazyExpenseChart {...props} />
    </Suspense>
  )
}

export function LazyAchievementsWrapper(props: AchievementsProps) {
  return (
    <Suspense fallback={<Loading message="Carregando conquistas..." />}>
      <LazyAchievements {...props} />
    </Suspense>
  )
}

export function LazyMaintenanceForecastWrapper(props: MaintenanceForecastProps) {
  return (
    <Suspense fallback={<Loading message="Carregando previsões..." />}>
      <LazyMaintenanceForecast {...props} />
    </Suspense>
  )
}

export function LazyCostAnalysisWrapper(props: CostAnalysisProps) {
  return (
    <Suspense fallback={<Loading message="Carregando análise..." />}>
      <LazyCostAnalysis {...props} />
    </Suspense>
  )
}

export function LazySmartAlertsWrapper(props: SmartAlertsProps) {
  return (
    <Suspense fallback={<Loading message="Carregando alertas..." />}>
      <LazySmartAlerts {...props} />
    </Suspense>
  )
}
