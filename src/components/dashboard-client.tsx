"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FAB } from "@/components/fab"
import { GloveMode } from "@/components/glove-mode"
import { ExpenseChart } from "@/components/expense-chart"
import { DashboardHeader } from "@/components/dashboard/header"
import Link from "next/link"
import { createMaintenanceLog } from "@/app/actions"
import { toast } from "sonner"
import { DashboardAlerts } from "@/components/dashboard/alerts"
import { DashboardMetrics } from "@/components/dashboard/metrics"
import { PendingTasks } from "@/components/dashboard/pending-tasks"
import { RecentHistory } from "@/components/dashboard/recent-history"
import { AgentsPanel } from "@/components/dashboard/agents-panel"
import { LazyExpenseChartWrapper, LazyAchievementsWrapper, LazyMaintenanceForecastWrapper, LazyCostAnalysisWrapper, LazySmartAlertsWrapper } from "@/components/dashboard/lazy-components"
import { HealthScore } from "@/components/dashboard"
import { useMemoizedMetrics } from "@/hooks/use-memoized-data"
import { Achievements } from "@/components/achievements"
import { VehicleSummary, PendingTask } from "@/types"
import { MAINTENANCE_TYPE_MAP } from "@/lib/constants/maintenance"
import { usePredictiveMaintenance, useSmartAlerts, useVehicleMetrics } from "@/hooks"

interface DashboardClientProps {
  vehicle: VehicleSummary
  pending: PendingTask[]
}

export function DashboardClient({ vehicle, pending }: DashboardClientProps) {
  const [gloveMode, setGloveMode] = useState(false)

  // Memoized metrics for performance
  const memoizedMetrics = useMemoizedMetrics(vehicle)
  
  // Advanced hooks for predictive analytics
  const vehicleMetrics = useVehicleMetrics(vehicle)
  const predictiveData = usePredictiveMaintenance(vehicle)
  const smartAlerts = useSmartAlerts(vehicle)

  // Generate alerts from insights when component mounts
  useEffect(() => {
    const alerts = smartAlerts.generateAlertsFromInsights(
      predictiveData.insights,
      vehicle.currentKm
    )
    alerts.forEach(alert => smartAlerts.addAlert(alert))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictiveData.insights, vehicle.currentKm]) // Intentionally exclude smartAlerts to prevent loop

  const handleQuickLog = async (actionName: string) => {
    try {
      await createMaintenanceLog({
        vehicleId: vehicle.id,
        type: MAINTENANCE_TYPE_MAP[actionName] ?? "PREVENTIVE",
        description: actionName,
        kmAtService: vehicle.currentKm,
      })
      toast.success(`${actionName} registrado!`)
    } catch {
      toast.error("Erro ao registrar")
    }
  }


  if (gloveMode) {
    return (
      <GloveMode 
        vehicleId={vehicle.id} 
        onClose={() => setGloveMode(false)}
        onQuickLog={handleQuickLog}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 selection:bg-foreground/10 font-mono">
      <DashboardHeader vehicle={vehicle} />

      <main className="p-4 space-y-5">
        {/* Smart Alerts - Top Priority */}
        <LazySmartAlertsWrapper
          alerts={smartAlerts.alerts}
          unreadCount={smartAlerts.unreadCount}
          criticalCount={smartAlerts.criticalCount}
          onMarkAsRead={smartAlerts.markAsRead}
          onMarkAllAsRead={smartAlerts.markAllAsRead}
          onClearAlerts={smartAlerts.clearAlerts}
        />

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <HealthScore healthScore={predictiveData.healthScore} />
          <DashboardMetrics vehicle={vehicle} />
        </div>

        {/* Predictive Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LazyMaintenanceForecastWrapper 
            insights={predictiveData.insights}
            nextMaintenanceDate={predictiveData.nextMaintenanceDate}
          />
          <LazyCostAnalysisWrapper 
            usagePattern={predictiveData.usagePattern}
            projectedCosts={predictiveData.projectedCosts}
          />
        </div>

        {/* AI Agents Panel */}
        <AgentsPanel />

        {/* Traditional Components */}
        <DashboardAlerts vehicle={vehicle} />
        <PendingTasks pending={pending} />
        <RecentHistory logs={vehicle.maintenanceLogs} />

        {/* Financial Analysis */}
        <LazyExpenseChartWrapper logs={vehicle.maintenanceLogs} />

        {/* Gamification - Achievements */}
        <LazyAchievementsWrapper 
          maintenanceLogs={vehicle.maintenanceLogs}
          totalSpent={memoizedMetrics.totalSpent}
          currentKm={vehicle.currentKm}
        />

        {/* Recommendations */}
        {predictiveData.recommendations.length > 0 && (
          <Card className="bg-muted border-4 border-dashed border-foreground rounded-none shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase">
                Recomendações Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {predictiveData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-foreground font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>

      <FAB />
    </div>
  )
}
