"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { PREDICTIVE_RULES, ALERT_THRESHOLD_KM } from "@/lib/constants/maintenance"
import { MaintenanceAlert } from "@/types"

interface DashboardAlertsProps {
  vehicle: {
    currentKm: number
    maintenanceLogs: {
      description: string
      kmAtService: number
    }[]
  }
}

export function DashboardAlerts({ vehicle }: DashboardAlertsProps) {
  const alerts: MaintenanceAlert[] = []

  PREDICTIVE_RULES.forEach(rule => {
    const latestLog = vehicle.maintenanceLogs
      .filter(log => log.description.toLowerCase().includes(rule.keyword))
      .sort((a, b) => b.kmAtService - a.kmAtService)[0]

    if (latestLog) {
      const remainingKm = (latestLog.kmAtService + rule.lifespan) - vehicle.currentKm
      if (remainingKm <= ALERT_THRESHOLD_KM) {
        alerts.push({
          name: rule.name,
          remaining: remainingKm,
          isOverdue: remainingKm < 0
        })
      }
    }
  })

  if (alerts.length === 0) return null

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => (
        <Card key={idx} className={`rounded-none border-4 ${alert.isOverdue ? 'border-foreground bg-foreground text-background' : 'border-foreground bg-background text-foreground'}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-6 w-6 ${alert.isOverdue ? 'text-background' : 'text-foreground'}`} />
              <div>
                <p className="font-black uppercase">{alert.name}</p>
                <p className="text-xs font-bold uppercase opacity-90">
                  {alert.isOverdue ? `VENCEU HÁ ${Math.abs(alert.remaining)} KM` : `VENCE EM ${alert.remaining} KM`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
