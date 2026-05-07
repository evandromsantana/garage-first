"use client"

import { useState, useEffect } from "react"
import { PredictiveInsight } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, AlertTriangle, Clock, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib"
import { cn } from "@/lib/utils"

interface MaintenanceForecastProps {
  insights: PredictiveInsight[]
  nextMaintenanceDate: Date | null
}

export function MaintenanceForecast({ insights, nextMaintenanceDate }: MaintenanceForecastProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  useEffect(() => {
    // Usar setTimeout para evitar setState síncrono no effect
    const timeout = setTimeout(() => {
      setMounted(true)
    }, 0)
    
    const interval = setInterval(() => setCurrentTime(Date.now()), 60 * 1000)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-600"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-600"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-600"
      default:
        return "bg-blue-100 text-blue-800 border-blue-600"
    }
  }

  const getCriticalityIcon = (criticality: string) => {
    switch (criticality) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getDaysUntil = (dueDate: Date | null) => {
    if (!dueDate || !mounted) return null
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const upcomingMaintenance = insights
    .filter(insight => insight.dueDate && insight.dueDate.getTime() > currentTime)
    .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
    .slice(0, 5)

  const overdueMaintenance = insights
    .filter(insight => insight.dueKm && insight.dueDate && insight.dueDate.getTime() <= currentTime)

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
          <Calendar className="h-5 w-5" />
          Previsão de Manutenção
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Next Maintenance Summary */}
        {nextMaintenanceDate && (
          <div className="text-center p-3 bg-muted border-2 border-dashed border-foreground rounded">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-bold uppercase">Próxima Manutenção</span>
            </div>
            <div className="text-lg font-black">
              {mounted && nextMaintenanceDate ? nextMaintenanceDate.toLocaleDateString("pt-BR") : "Carregando..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {mounted ? (
                getDaysUntil(nextMaintenanceDate) !== null && (
                  <>Em {getDaysUntil(nextMaintenanceDate)} dias</>
                )
              ) : (
                "Carregando..."
              )}
            </div>
          </div>
        )}

        {/* Overdue Maintenance */}
        {overdueMaintenance.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              ATRASADAS ({overdueMaintenance.length})
            </h4>
            {overdueMaintenance.slice(0, 2).map((insight, index) => (
              <div
                key={`${insight.name}-${index}`}
                className="p-2 bg-red-50 border-2 border-red-600 rounded"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{insight.name}</span>
                  <span className="text-xs text-red-600 font-bold">
                    {insight.dueKm ? `${Math.abs(insight.dueKm - (insight.dueKm || 0))}km` : ""}
                  </span>
                </div>
                {insight.estimatedCost && (
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs">{formatCurrency(insight.estimatedCost)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Maintenance */}
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase">Próximas</h4>
          {upcomingMaintenance.length > 0 ? (
            upcomingMaintenance.map((insight, index) => (
              <div
                key={`${insight.name}-${index}`}
                className={cn(
                  "p-3 border-2 rounded",
                  getCriticalityColor(insight.criticality)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCriticalityIcon(insight.criticality)}
                    <div>
                      <div className="text-sm font-bold">{insight.name}</div>
                      {insight.dueDate && (
                        <div className="text-xs opacity-75">
                          {insight.dueDate.toLocaleDateString("pt-BR")}
                          {getDaysUntil(insight.dueDate) !== null && (
                            <> • {getDaysUntil(insight.dueDate)} dias</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black uppercase opacity-60">
                      URGÊNCIA: {Math.round(insight.urgencyScore)}/100
                    </div>
                    {insight.estimatedCost && (
                      <div className="text-xs mt-1">
                        {formatCurrency(insight.estimatedCost)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground text-sm">
              Nenhuma manutenção prevista
            </div>
          )}
        </div>

        {/* Cost Projection */}
        <div className="pt-3 border-t-2 border-muted">
          <div className="text-sm font-bold uppercase mb-2">Projeção de Custos</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-bold">30 dias</div>
              <div className="text-muted-foreground">
                {formatCurrency(
                  insights
                    .filter(i => i.dueDate && getDaysUntil(i.dueDate)! <= 30)
                    .reduce((sum, i) => sum + (i.estimatedCost || 0), 0)
                )}
              </div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-bold">90 dias</div>
              <div className="text-muted-foreground">
                {formatCurrency(
                  insights
                    .filter(i => i.dueDate && getDaysUntil(i.dueDate)! <= 90)
                    .reduce((sum, i) => sum + (i.estimatedCost || 0), 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
