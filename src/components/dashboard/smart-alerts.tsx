"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SmartAlert } from "@/types"
import { AlertCircle, AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react"

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
        return <ShieldAlert className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-foreground text-background border-4 border-foreground"
      case "error":
        return "bg-background text-foreground border-4 border-foreground"
      case "warning":
        return "bg-background text-foreground border-4 border-foreground border-double"
      default:
        return "bg-background text-foreground border-2 border-foreground border-dashed"
    }
  }

  const displayAlerts = alerts.slice(0, 5)

  return (
    <Card className="kindle-card">
      <CardHeader className="pb-4 border-b-4 border-foreground bg-muted/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic">
            <AlertTriangle className="h-6 w-6" />
            Alertas de Diagnóstico
            {unreadCount > 0 && (
              <span className="bg-foreground text-background px-2 py-0.5 text-xs font-black">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                onClick={onMarkAllAsRead}
                className="h-8 px-2 text-[10px] font-black uppercase border-2 border-foreground"
              >
                Lidos
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 divide-y-2 divide-foreground">
        {alerts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-2 opacity-20">
            <CheckCircle className="h-10 w-10" />
            <p className="text-xs font-black uppercase">Sistemas Operacionais Normais</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-foreground">
            {displayAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-5 transition-none",
                  alert.severity === "critical" ? "bg-foreground text-background" : "bg-background text-foreground"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <div className="text-lg font-black uppercase italic tracking-tight">{alert.title}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {alert.type} • {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      onClick={() => onMarkAsRead(alert.id)}
                      className={cn("h-8 w-8 p-0 border-2", alert.severity === "critical" ? "border-background" : "border-foreground")}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <p className="text-sm font-bold mb-4 leading-relaxed">{alert.message}</p>

                {alert.estimatedCost && (
                  <div className="text-xs font-black uppercase mb-4 px-3 py-1 border-2 border-current inline-block">
                    Impacto Estimado: {alert.estimatedCost.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </div>
                )}

                {alert.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase opacity-60">Procedimentos Recomendados:</div>
                    <ul className="space-y-1">
                      {alert.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs font-bold">
                          <span className="opacity-40 mt-1">[{index + 1}]</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
