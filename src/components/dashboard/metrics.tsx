"use client"

import { VehicleSummary } from "@/types"
import { useVehicleMetrics } from "@/hooks/use-vehicle-metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardMetricsProps {
  vehicle: VehicleSummary
}

export function DashboardMetrics({ vehicle }: DashboardMetricsProps) {
  const metrics = useVehicleMetrics(vehicle)
  
  // Calcular métricas adicionais
  const costPerKm = vehicle.currentKm > 0 ? metrics.totalSpent / vehicle.currentKm : 0
  const maintenanceFrequency = metrics.daysSinceLastMaintenance || 0
  
  return (
    <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="border-b-4 border-foreground pb-4">
        <CardTitle className="font-black uppercase text-center">
          Métricas do Veículo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-black">{metrics.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className="text-sm text-muted-foreground">Total Gasto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black">{metrics.totalMaintenance}</div>
            <div className="text-sm text-muted-foreground">Manutenções</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-black">{costPerKm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className="text-sm text-muted-foreground">Custo por KM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black">{metrics.averageCostPerMaintenance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className="text-sm text-muted-foreground">Custo Médio</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-black">{metrics.daysSinceLastMaintenance || 0}</div>
            <div className="text-sm text-muted-foreground">Dias Última Manutenção</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black">{metrics.partsUsed}</div>
            <div className="text-sm text-muted-foreground">Peças Usadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
