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
      <Card className="bg-card border-4 border-foreground rounded-none shadow-[2px_2px_0_0_colord(var(--foreground))] hover:bg-foreground/5 transition-none overflow-hidden relative group">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-foreground mb-2">
            <Gauge className="h-5 w-5 font-bold" />
            <span className="text-xs font-bold uppercase">Odômetro</span>
          </div>
          <p className="text-2xl font-black">{formatNumber(currentKm)}</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-4 border-foreground rounded-none shadow-[2px_2px_0_0_colord(var(--foreground))] hover:bg-foreground/5 transition-none overflow-hidden relative group">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-foreground mb-2">
            <TrendingUp className="h-5 w-5 font-bold" />
            <span className="text-xs font-bold uppercase">TCO (R$/KM)</span>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-black">
              {formatCurrency(costPerKm)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
