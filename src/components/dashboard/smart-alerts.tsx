"use client"

import { SmartAlert } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartAlertsProps {
  alerts: SmartAlert[]
  unreadCount: number
  criticalCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAlerts: () => void
}

export function SmartAlerts({ 
  alerts, 
  unreadCount, 
  criticalCount, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClearAlerts 
}: SmartAlertsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-600 text-red-800"
      case "error":
        return "bg-red-50 border-red-500 text-red-700"
      case "warning":
        return "bg-yellow-50 border-yellow-600 text-yellow-800"
      default:
        return "bg-blue-50 border-blue-600 text-blue-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "maintenance_due":
        return "Manutenção"
      case "cost_spike":
        return "Custos"
      case "part_wear":
        return "Peças"
      case "seasonal":
        return "Sazonal"
      case "performance":
        return "Performance"
      default:
        return type
    }
  }

  const displayAlerts = alerts.slice(0, 10) // Limit to 10 most recent

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
            <AlertTriangle className="h-5 w-5" />
            Alertas Inteligentes
            {unreadCount > 0 && (
              <span className="bg-foreground text-background px-2 py-1 text-xs font-bold rounded">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8 px-2 text-xs font-bold uppercase"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Ler Todas
              </Button>
            )}
            {alerts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAlerts}
                className="h-8 px-2 text-xs font-bold uppercase"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold uppercase">Nenhum alerta</p>
            <p className="text-xs">Tudo em ordem!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Critical Summary */}
            {criticalCount > 0 && (
              <div className="p-3 bg-red-50 border-2 border-red-600 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-red-800">
                    {criticalCount} alerta(s) crítico(s) exigem atenção
                  </span>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            )}

            {/* Alerts List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {displayAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-3 border-2 rounded transition-all",
                    getSeverityColor(alert.severity),
                    !alert.isRead && "font-bold"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <div className="text-sm font-bold">{alert.title}</div>
                        <div className="text-xs opacity-75">
                          {getTypeLabel(alert.type)} • {alert.createdAt.toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <p className="text-xs mb-2">{alert.message}</p>

                  {alert.estimatedCost && (
                    <div className="text-xs font-bold mb-2">
                      Custo estimado: {alert.estimatedCost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </div>
                  )}

                  {alert.actionItems.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-current/20">
                      <div className="text-xs font-bold mb-1">Ações recomendadas:</div>
                      <ul className="text-xs space-y-1">
                        {alert.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-current/50">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {alert.dueDate && (
                    <div className="text-xs mt-2 pt-2 border-t border-current/20">
                      <span className="font-bold">Prazo: </span>
                      {alert.dueDate.toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* More alerts indicator */}
            {alerts.length > displayAlerts.length && (
              <div className="text-center pt-2 border-t-2 border-muted">
                <p className="text-xs text-muted-foreground">
                  +{alerts.length - displayAlerts.length} alertas não exibidos
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
