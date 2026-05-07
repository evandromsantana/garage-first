"use client"

import { UsagePattern } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, DollarSign, Activity } from "lucide-react"
import { formatCurrency } from "@/lib"
import { cn } from "@/lib/utils"

interface CostAnalysisProps {
  usagePattern: UsagePattern
  projectedCosts: {
    next30Days: number
    next90Days: number
    next6Months: number
  }
}

export function CostAnalysis({ usagePattern, projectedCosts }: CostAnalysisProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-600"
      case "decreasing":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getMaintenanceTypeLabel = (type: string) => {
    switch (type) {
      case "PREVENTIVE":
        return "Preventiva"
      case "CORRECTIVE":
        return "Corretiva"
      case "UPGRADE":
        return "Upgrade"
      default:
        return type
    }
  }

  const monthlyProjection = projectedCosts.next30Days
  const monthlyAverage = projectedCosts.next90Days / 3
  const monthlyProjection6Months = projectedCosts.next6Months / 6

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
          <DollarSign className="h-5 w-5" />
          Análise de Custos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-4 border-b-4 border-foreground pb-4">
          <div className="border-2 border-foreground p-2 text-center bg-muted/30">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Estilo de Pilotagem</p>
            <p className="text-xl font-black uppercase text-foreground">
              {usagePattern.ridingStyle === "TRACK_DAY" ? "Autódromo" : 
               usagePattern.ridingStyle === "AGGRESSIVE" ? "Agressivo" : 
               usagePattern.ridingStyle === "TOURING" ? "Viagem" : "Urbano"}
            </p>
          </div>
          <div className="border-2 border-foreground p-2 text-center bg-muted/30">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Média Mensal</p>
            <p className="text-xl font-black">{Math.round(usagePattern?.averageKmPerMonth ?? 0)} <span className="text-xs">km/mês</span></p>
          </div>
        </div>

        {/* Usage Pattern */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase">Padrão de Uso</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted border-2 border-dashed border-foreground rounded">
              <div className="text-xs font-bold uppercase text-muted-foreground">KM/Mês</div>
              <div className="text-lg font-black">
                {(usagePattern?.averageKmPerMonth ?? 0).toLocaleString("pt-BR")}
              </div>
            </div>
            <div className="p-3 bg-muted border-2 border-dashed border-foreground rounded">
              <div className="text-xs font-bold uppercase text-muted-foreground">Tipo + Freq</div>
              <div className="text-sm font-bold">
                {getMaintenanceTypeLabel(usagePattern.mostFrequentType)}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Trend */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tendência de Custos
          </h4>
          <div className="flex items-center justify-between p-3 bg-muted border-2 border-dashed border-foreground rounded">
            <span className="text-sm font-bold">Tendência</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(usagePattern.costTrend)}
              <span className={cn("text-sm font-bold", getTrendColor(usagePattern.costTrend))}>
                {usagePattern.costTrend === "increasing" && "Aumentando"}
                {usagePattern.costTrend === "decreasing" && "Reduzindo"}
                {usagePattern.costTrend === "stable" && "Estável"}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Projections */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase">Projeção de Custos</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border-2 border-foreground rounded">
              <span className="text-sm font-bold">Próximos 30 dias</span>
              <span className="text-sm font-black">{formatCurrency(monthlyProjection)}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted border-2 border-dashed border-foreground rounded">
              <span className="text-sm font-bold">Média mensal (90d)</span>
              <span className="text-sm font-black">{formatCurrency(monthlyAverage)}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted border-2 border-dashed border-foreground rounded">
              <span className="text-sm font-bold">Média mensal (6m)</span>
              <span className="text-sm font-black">{formatCurrency(monthlyProjection6Months)}</span>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase">Análise</h4>
          <div className="space-y-2 text-xs">
            {monthlyProjection > monthlyAverage * 1.2 && (
              <div className="p-2 bg-red-50 border-2 border-red-600 rounded">
                <span className="font-bold text-red-800">
                  ⚠️ Custos próximos 30 dias 20% acima da média
                </span>
              </div>
            )}
            {usagePattern.costTrend === "increasing" && (
              <div className="p-2 bg-orange-50 border-2 border-orange-600 rounded">
                <span className="font-bold text-orange-800">
                  📈 Tendência de aumento detectada
                </span>
              </div>
            )}
            {usagePattern.averageKmPerMonth > 2000 && (
              <div className="p-2 bg-blue-50 border-2 border-blue-600 rounded">
                <span className="font-bold text-blue-800">
                  🏍️ Alto uso mensal detectado
                </span>
              </div>
            )}
            {usagePattern.costTrend === "decreasing" && (
              <div className="p-2 bg-green-50 border-2 border-green-600 rounded">
                <span className="font-bold text-green-800">
                  ✅ Custos sob controle
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="pt-3 border-t-2 border-muted">
          <h4 className="text-sm font-black uppercase mb-2">Recomendações</h4>
          <div className="space-y-1 text-xs">
            {monthlyProjection > 1000 && (
              <div className="font-bold text-muted-foreground">
                • Considerar plano de manutenção preventiva
              </div>
            )}
            {usagePattern.mostFrequentType === "CORRECTIVE" && (
              <div className="font-bold text-muted-foreground">
                • Focar em manutenções preventivas para reduzir custos
              </div>
            )}
            {usagePattern.averageKmPerMonth > 1500 && (
              <div className="font-bold text-muted-foreground">
                • Monitorar desgaste com mais frequência
              </div>
            )}
            <div className="font-bold text-muted-foreground">
              • Comparar preços de peças e serviços periodicamente
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
