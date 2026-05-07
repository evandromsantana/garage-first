"use client"

import { VehicleSummary } from "@/types"
import { usePredictiveMaintenance, useMemoizedMetrics } from "@/hooks"
import { useMemoizedAnalytics } from "@/hooks/use-memoized-data"
import { LazyExpenseChartWrapper, LazyCostAnalysisWrapper, LazyMaintenanceForecastWrapper, LazyAchievementsWrapper } from "@/components/dashboard/lazy-components"
import { AgentsPanel } from "@/components/dashboard/agents-panel"
import { MaintenanceRoadmap } from "@/components/analytics/maintenance-roadmap"
import { HealthScore } from "@/components/analytics/health-score"
import { SmartInsights } from "@/components/analytics/smart-insights"

export function AnalyticsClient({ vehicle }: { vehicle: VehicleSummary }) {
  const predictiveData = usePredictiveMaintenance(vehicle.maintenanceLogs || [], vehicle.currentKm || 0)
  const memoizedMetrics = useMemoizedMetrics(vehicle)
  const analytics = useMemoizedAnalytics(vehicle)

  // Transform predictive insights into the format expected by SmartInsights
  const formattedInsights = predictiveData.insights.map(insight => ({
    type: (insight.criticality === 'high' || insight.criticality === 'critical' ? 'alert' : 'info') as 'info' | 'alert' | 'warning' | 'success',
    text: `${insight.name}: ${insight.recommendations[0] || 'Manutenção recomendada em breve'}`
  }))

  return (
    <div className="space-y-10 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <HealthScore score={analytics.healthScore} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <SmartInsights insights={formattedInsights} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <LazyMaintenanceForecastWrapper 
              insights={predictiveData.insights}
              nextMaintenanceDate={predictiveData.nextMaintenanceDate}
            />
            <LazyCostAnalysisWrapper 
              usagePattern={predictiveData.usagePattern}
              projectedCosts={predictiveData.projectedCosts}
            />
          </div>
        </div>
      </section>

      <div className="border-t-4 border-foreground pt-10">
        <MaintenanceRoadmap currentKm={vehicle.currentKm} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="kindle-card space-y-4">
           <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest">Fluxo de Desembolso</h3>
          </div>
          <LazyExpenseChartWrapper maintenanceLogs={vehicle.maintenanceLogs} />
        </div>
        
        <LazyAchievementsWrapper 
          maintenanceLogs={vehicle.maintenanceLogs}
          totalSpent={memoizedMetrics.totalSpent}
          currentKm={vehicle.currentKm}
        />
      </div>

      <div className="border-t-4 border-foreground pt-10">
        <AgentsPanel />
      </div>
    </div>
  )
}
