"use client"

import { VehicleSummary } from "@/types"
import { useVehicleMetrics } from "@/hooks/use-vehicle-metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, Calculator } from "lucide-react"

interface DashboardMetricsProps {
  vehicle: VehicleSummary
}

export function DashboardMetrics({ vehicle }: DashboardMetricsProps) {
  const metrics = useVehicleMetrics(vehicle)
  
  // Calcular métricas adicionais
  const costPerKm = vehicle.currentKm > 0 ? metrics.totalSpent / vehicle.currentKm : 0
  
  return (
    <Card className="kindle-card">
      <CardHeader className="border-b-4 border-foreground pb-4">
        <CardTitle className="text-xl font-black uppercase italic flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Análise de Eficiência
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y-2 divide-foreground">
          {/* Main Financial KPI */}
          <div className="p-8 text-center bg-muted/10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2 block">Custo Operacional Real</span>
            <div className="text-5xl font-black italic tracking-tighter leading-none">
              {costPerKm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              <span className="text-sm not-italic opacity-40 ml-1">/KM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x-2 divide-foreground">
            <div className="p-5 text-center">
              <span className="text-[9px] font-black uppercase opacity-40 block mb-1">Total Investido</span>
              <div className="text-xl font-black">{metrics.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
            <div className="p-5 text-center">
              <span className="text-[9px] font-black uppercase opacity-40 block mb-1">Ticket Médio</span>
              <div className="text-xl font-black">{metrics.averageCostPerMaintenance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x-2 divide-foreground">
            <div className="p-4 text-center">
              <span className="text-[8px] font-black uppercase opacity-40 block mb-1">Peças</span>
              <div className="text-lg font-black">{metrics.partsUsed}</div>
            </div>
            <div className="p-4 text-center">
              <span className="text-[8px] font-black uppercase opacity-40 block mb-1">Serviços</span>
              <div className="text-lg font-black">{metrics.totalMaintenance}</div>
            </div>
            <div className="p-4 text-center">
              <span className="text-[8px] font-black uppercase opacity-40 block mb-1">Parada</span>
              <div className="text-lg font-black">{metrics.daysSinceLastMaintenance || 0}d</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
