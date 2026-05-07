/**
 * Lazy Components - Componentes com lazy loading para otimizar performance
 * Carrega componentes apenas quando necessários
 */

import { lazy, Suspense } from 'react'
import { Loading } from '@/components/ui/loading'
import { PredictiveInsight, MaintenanceLogSummary, UsagePattern, SmartAlert } from '@/types'

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
  import('@/components/dashboard/maintenance-forecast').then(module => ({ 
    default: module.MaintenanceForecast 
  }))
)

export const LazyCostAnalysis = lazy(() => 
  import('@/components/dashboard/cost-analysis').then(module => ({ 
    default: module.CostAnalysis 
  }))
)

export const LazySmartAlerts = lazy(() => 
  import('@/components/dashboard/smart-alerts').then(module => ({ 
    default: module.SmartAlerts 
  }))
)

// Tipos para os props dos componentes
interface ExpenseChartProps {
  maintenanceLogs?: MaintenanceLogSummary[]
}

interface AchievementsProps {
  maintenanceLogs: MaintenanceLogSummary[]
  totalSpent: number
  currentKm: number
}

interface MaintenanceForecastProps {
  insights: PredictiveInsight[]
  nextMaintenanceDate: Date | null
}

interface CostAnalysisProps {
  usagePattern: UsagePattern
  projectedCosts: {
    next30Days: number
    next90Days: number
    next6Months: number
  }
}

interface SmartAlertsProps {
  alerts: SmartAlert[]
  unreadCount: number
  criticalCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAlerts: () => void
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
