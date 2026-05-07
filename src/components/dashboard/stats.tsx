"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Gauge, TrendingUp } from "lucide-react"
import { formatCurrency, formatNumber, calculateCostPerKm } from "@/lib/utils"

interface DashboardStatsProps {
  currentKm: number
  totalSpent: number
}

export function DashboardStats({ currentKm, totalSpent }: DashboardStatsProps) {
  const costPerKm = calculateCostPerKm(totalSpent, currentKm)

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground/5 transition-none overflow-hidden relative group animate-in slide-in-from-left-4 duration-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-foreground mb-2">
            <Gauge className="h-5 w-5 font-bold" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Odômetro (KM)</span>
          </div>
          <p className="text-3xl font-black leading-none">{formatNumber(currentKm)}</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground/5 transition-none overflow-hidden relative group animate-in slide-in-from-right-4 duration-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-foreground mb-2">
            <TrendingUp className="h-5 w-5 font-bold" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Custo de Rodagem</span>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-black leading-none">
              {formatCurrency(costPerKm)}
            </p>
            <span className="text-[10px] font-black uppercase opacity-40 mb-0.5">/KM</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
