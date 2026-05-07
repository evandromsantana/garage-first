"use client"

import { useMemo, useState, useCallback } from "react"
import { SmartAlert, VehicleSummary, PredictiveInsight } from "@/types"
import { ALERT_THRESHOLD_KM } from "@/lib/constants/maintenance"

interface UseSmartAlertsReturn {
  alerts: SmartAlert[]
  unreadCount: number
  criticalCount: number
  addAlert: (alert: Omit<SmartAlert, "id" | "createdAt" | "isRead">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAlerts: () => void
  generateAlertsFromInsights: (insights: PredictiveInsight[], currentKm: number) => SmartAlert[]
}

export function useSmartAlerts(
  vehicle: VehicleSummary | undefined,
  insights: PredictiveInsight[] = []
): UseSmartAlertsReturn {
  const [manualAlerts, setManualAlerts] = useState<SmartAlert[]>([])

  const systemAlerts = useMemo(() => {
    const newAlerts: SmartAlert[] = []
    const currentKm = vehicle?.currentKm || 0

    insights.forEach(insight => {
      const kmRemaining = insight.dueKm ? insight.dueKm - currentKm : 0
      const daysUntil = insight.dueDate 
        ? Math.floor((insight.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

      // Maintenance due alerts
      if (kmRemaining <= 0) {
        newAlerts.push({
          id: `maintenance-overdue-${insight.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: "maintenance_due",
          severity: insight.criticality === "critical" ? "critical" : 
                   insight.criticality === "high" ? "error" : "warning",
          title: `${insight.name} ATRASADA`,
          message: `Manutenção está ${Math.abs(kmRemaining)}km atrasada`,
          actionItems: [
            "Agendar manutenção imediatamente",
            "Verificar disponibilidade de peças",
            "Considerar impacto no uso diário"
          ],
          estimatedCost: insight.estimatedCost,
          dueDate: new Date(),
          createdAt: new Date(),
          isRead: false
        })
      } else if (kmRemaining <= ALERT_THRESHOLD_KM) {
        newAlerts.push({
          id: `maintenance-due-${insight.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: "maintenance_due",
          severity: insight.criticality === "critical" ? "error" : "warning",
          title: `${insight.name} em breve`,
          message: `Manutenção necessária em ${kmRemaining}km ou ${daysUntil} dias`,
          actionItems: [
            "Agendar manutenção para próxima semana",
            "Verificar custos com oficina",
            "Preparar veículo para serviço"
          ],
          estimatedCost: insight.estimatedCost,
          dueDate: insight.dueDate || undefined,
          createdAt: new Date(),
          isRead: false
        })
      }

      // High urgency alerts
      if (insight.urgencyScore >= 80) {
        newAlerts.push({
          id: `urgency-${insight.name.toLowerCase().replace(/\s+/g, '-')}-${insight.urgencyScore}`,
          type: "performance",
          severity: "warning",
          title: `Alta Prioridade: ${insight.name}`,
          message: `Score de urgência: ${insight.urgencyScore}/100`,
          actionItems: insight.recommendations,
          estimatedCost: insight.estimatedCost,
          dueDate: insight.dueDate || undefined,
          createdAt: new Date(),
          isRead: false
        })
      }
    })

    // Cost spike detection
    const recentMaintenances = (vehicle?.maintenanceLogs || [])
      .filter(log => {
        const daysSince = (Date.now() - new Date(log.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysSince <= 30
      })

    if (recentMaintenances.length >= 2) {
      const recentCosts = recentMaintenances.map(log => 
        (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0)
      )
      const avgRecentCost = recentCosts.reduce((a, b) => a + b, 0) / recentCosts.length
      
      if (avgRecentCost > 1000) {
        newAlerts.push({
          id: "cost-spike",
          type: "cost_spike",
          severity: "warning",
          title: "Aumento de Custos Detectado",
          message: `Custo médio recente: R$${avgRecentCost.toFixed(2)}`,
          actionItems: [
            "Analisar causas do aumento",
            "Comparar com preços de mercado",
            "Considerar alternativas de peças"
          ],
          createdAt: new Date(),
          isRead: false
        })
      }
    }

    return newAlerts
  }, [insights, vehicle?.currentKm, vehicle?.maintenanceLogs])

  const alerts = useMemo(() => 
    [...manualAlerts, ...systemAlerts].sort((a, b) => {
      const severityOrder = { critical: 4, error: 3, warning: 2, info: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    }), 
    [manualAlerts, systemAlerts]
  )

  const addAlert = useCallback((alert: Omit<SmartAlert, "id" | "createdAt" | "isRead">) => {
    const newAlert: SmartAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isRead: false
    }
    setManualAlerts(prev => [newAlert, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setManualAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setManualAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
  }, [])

  const clearAlerts = useCallback(() => {
    setManualAlerts([])
  }, [])

  const unreadCount = useMemo(() => 
    alerts.filter(alert => !alert.isRead).length,
    [alerts]
  )

  const criticalCount = useMemo(() => 
    alerts.filter(alert => alert.severity === "critical" || alert.severity === "error").length,
    [alerts]
  )

  const generateAlertsFromInsights = useCallback(() => [], []) // Deprecated but kept for compatibility

  return {
    alerts,
    unreadCount,
    criticalCount,
    addAlert,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    generateAlertsFromInsights
  }
}
