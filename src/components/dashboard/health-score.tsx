"use client"

import { VehicleHealthScore } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthScoreProps {
  healthScore: VehicleHealthScore
}

export function HealthScore({ healthScore }: HealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-600"
    if (score >= 60) return "bg-yellow-100 border-yellow-600"
    if (score >= 40) return "bg-orange-100 border-orange-600"
    return "bg-red-100 border-red-600"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const categories = [
    { name: "Motor", score: healthScore.engine, key: "engine" },
    { name: "Freios", score: healthScore.brakes, key: "brakes" },
    { name: "Pneus", score: healthScore.tires, key: "tires" },
    { name: "Eletrônica", score: healthScore.electronics, key: "electronics" },
  ]

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
          <Heart className="h-5 w-5" />
          Score de Saúde
          {getTrendIcon(healthScore.trend)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Overall Score */}
        <div className="text-center mb-6">
          <div className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-full border-4 text-3xl font-black",
            getScoreBg(healthScore.overall),
            getScoreColor(healthScore.overall)
          )}>
            {Math.round(healthScore.overall)}
          </div>
          <p className="text-xs font-bold uppercase mt-2 text-muted-foreground">
            Score Geral
          </p>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category.key}
              className={cn(
                "border-2 rounded p-3 text-center",
                getScoreBg(category.score),
                "border-opacity-50"
              )}
            >
              <div className={cn("text-xl font-black", getScoreColor(category.score))}>
                {Math.round(category.score)}
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                {category.name}
              </p>
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-3 border-t-2 border-muted text-center">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Atualizado: {healthScore.lastUpdated.toLocaleDateString("pt-BR")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
