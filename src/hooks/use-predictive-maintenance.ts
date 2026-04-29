"use client"

import { useMemo, useState, useEffect } from "react"
import { VehicleSummary, PredictiveInsight, UsagePattern, VehicleHealthScore, MaintenanceType } from "@/types"
import { PREDICTIVE_RULES, ALERT_THRESHOLD_KM } from "@/lib/constants/maintenance"

interface UsePredictiveMaintenanceReturn {
  insights: PredictiveInsight[]
  usagePattern: UsagePattern
  healthScore: VehicleHealthScore
  nextMaintenanceDate: Date | null
  projectedCosts: {
    next30Days: number
    next90Days: number
    next6Months: number
  }
  recommendations: string[]
  criticalAlerts: PredictiveInsight[]
}

export function usePredictiveMaintenance(vehicle: VehicleSummary): UsePredictiveMaintenanceReturn {
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const insights = useMemo(() => {
    const { maintenanceLogs, currentKm } = vehicle
    const insights: PredictiveInsight[] = []

    // Analyze each maintenance type based on rules
    PREDICTIVE_RULES.forEach(rule => {
      const relevantLogs = maintenanceLogs.filter(log => 
        log.description.toLowerCase().includes(rule.keyword.toLowerCase())
      )

      if (relevantLogs.length > 0) {
        const lastMaintenance = relevantLogs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]

        if (!lastMaintenance) return

        const lastKm = lastMaintenance.kmAtService
        const nextDueKm = lastKm + rule.lifespan
        const kmRemaining = nextDueKm - currentKm
        const daysSinceLast = Math.floor((currentTime - new Date(lastMaintenance.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        const avgKmPerDay = maintenanceLogs.length > 1 ? 
          (currentKm - lastMaintenance.kmAtService) / Math.max(daysSinceLast, 1) : 50 // Default 50km/day
        const daysUntilDue = kmRemaining > 0 ? Math.floor(kmRemaining / avgKmPerDay) : 0

        // Calculate urgency score (0-100)
        let urgencyScore = 0
        if (kmRemaining <= 0) urgencyScore = 100
        else if (kmRemaining <= ALERT_THRESHOLD_KM) urgencyScore = 80
        else if (kmRemaining <= rule.lifespan * 0.2) urgencyScore = 60
        else if (kmRemaining <= rule.lifespan * 0.5) urgencyScore = 40
        else urgencyScore = 20

        // Adjust urgency based on criticality
        const criticalityMultiplier = {
          low: 0.7,
          medium: 1.0,
          high: 1.3,
          critical: 1.6
        }[rule.criticality]
        urgencyScore = Math.min(100, urgencyScore * criticalityMultiplier)

        // Generate recommendations
        const recommendations: string[] = []
        if (kmRemaining <= 0) {
          recommendations.push(`IMEDIATO: ${rule.name} está ${Math.abs(kmRemaining)}km atrasado`)
        } else if (kmRemaining <= ALERT_THRESHOLD_KM) {
          recommendations.push(`AGENDAR: ${rule.name} em breve (${kmRemaining}km restantes)`)
        }
        
        if (rule.category === "engine") {
          recommendations.push("Verificar nível de óleo regularmente")
        }
        if (rule.category === "brakes") {
          recommendations.push("Testar frenagem em segurança antes de usar")
        }
        if (rule.category === "tires") {
          recommendations.push("Verificar pressão e desgaste dos pneus")
        }

        insights.push({
          name: rule.name,
          dueDate: daysUntilDue > 0 ? new Date(currentTime + (daysUntilDue * 24 * 60 * 60 * 1000)) : new Date(),
          dueKm: nextDueKm,
          criticality: rule.criticality,
          estimatedCost: getEstimatedCost(rule.name),
          recommendations,
          urgencyScore
        })
      } else {
        // First time maintenance - based on current KM
        const kmRemaining = rule.lifespan - currentKm
        const avgKmPerDay = 50
        const daysUntilDue = Math.floor(kmRemaining / avgKmPerDay)

        insights.push({
          name: rule.name,
          dueDate: daysUntilDue > 0 ? new Date(currentTime + (daysUntilDue * 24 * 60 * 60 * 1000)) : new Date(),
          dueKm: rule.lifespan,
          criticality: rule.criticality,
          estimatedCost: getEstimatedCost(rule.name),
          recommendations: [`Primeira ${rule.name} recomendada em ${rule.lifespan}km`],
          urgencyScore: kmRemaining <= ALERT_THRESHOLD_KM ? 60 : 20
        })
      }
    })

    return insights.sort((a, b) => b.urgencyScore - a.urgencyScore)
  }, [vehicle, currentTime])

  const usagePattern = useMemo(() => {
    const { maintenanceLogs } = vehicle
    
    if (maintenanceLogs.length < 2) {
      return {
        averageKmPerMonth: 1000, // Default estimate
        seasonalVariation: 0,
        mostFrequentType: "PREVENTIVE" as MaintenanceType,
        costTrend: "stable" as const,
        peakUsageMonth: null
      }
    }

    // Calculate KM per month
    const sortedLogs = [...maintenanceLogs].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    
    const firstLog = sortedLogs[0]
    const lastLog = sortedLogs[sortedLogs.length - 1]
    
    let averageKmPerMonth = 1000
    if (firstLog && lastLog) {
      const monthsDiff = (new Date(lastLog.createdAt).getTime() - new Date(firstLog.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
      const kmDiff = lastLog.kmAtService - firstLog.kmAtService
      averageKmPerMonth = monthsDiff > 0 ? kmDiff / monthsDiff : 1000
    }

    // Calculate cost trend
    const monthlyCosts = new Map<number, number>()
    maintenanceLogs.forEach(log => {
      const month = new Date(log.createdAt).getMonth()
      const cost = (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0)
      monthlyCosts.set(month, (monthlyCosts.get(month) ?? 0) + cost)
    })
    
    const costs = Array.from(monthlyCosts.values())
    const recentAvg = costs.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, costs.length)
    const olderAvg = costs.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, costs.length - 3)
    
    let costTrend: "increasing" | "decreasing" | "stable" = "stable"
    if (recentAvg > olderAvg * 1.2) costTrend = "increasing"
    else if (recentAvg < olderAvg * 0.8) costTrend = "decreasing"

    // Most frequent maintenance type
    const typeCounts = maintenanceLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const mostFrequentType = (Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] as MaintenanceType) || "PREVENTIVE"

    return {
      averageKmPerMonth,
      seasonalVariation: 0.15, // Simplified
      mostFrequentType,
      costTrend,
      peakUsageMonth: null // Simplified
    }
  }, [vehicle])

  const healthScore = useMemo(() => {
    const { maintenanceLogs, currentKm } = vehicle
    const categoryScores = {
      engine: 100,
      brakes: 100,
      tires: 100,
      electronics: 100,
      general: 100
    }

    // Calculate scores based on overdue maintenance
    insights.forEach(insight => {
      const rule = PREDICTIVE_RULES.find(r => r.name === insight.name)
      if (rule && insight.dueKm && currentKm > insight.dueKm) {
        const overdueKm = currentKm - insight.dueKm
        const penalty = Math.min(50, (overdueKm / rule.lifespan) * 50)
        if (rule.category in categoryScores) {
          categoryScores[rule.category] = Math.max(0, categoryScores[rule.category] - penalty)
        }
      }
    })

    const overall = Object.values(categoryScores).reduce((a, b) => a + b, 0) / 5

    return {
      overall,
      engine: categoryScores.engine,
      brakes: categoryScores.brakes,
      tires: categoryScores.tires,
      electronics: categoryScores.electronics,
      lastUpdated: new Date(),
      trend: "stable" as const
    }
  }, [vehicle, insights])

  const projectedCosts = useMemo(() => {
    const next30Days = insights
      .filter(i => {
        if (!i.dueDate) return false
        const daysUntil = (i.dueDate.getTime() - currentTime) / (1000 * 60 * 60 * 24)
        return daysUntil <= 30 && daysUntil >= 0
      })
      .reduce((sum, i) => sum + (i.estimatedCost ?? 0), 0)

    const next90Days = insights
      .filter(i => {
        if (!i.dueDate) return false
        const daysUntil = (i.dueDate.getTime() - currentTime) / (1000 * 60 * 60 * 24)
        return daysUntil <= 90 && daysUntil >= 0
      })
      .reduce((sum, i) => sum + (i.estimatedCost ?? 0), 0)

    const next6Months = insights
      .filter(i => {
        if (!i.dueDate) return false
        const daysUntil = (i.dueDate.getTime() - currentTime) / (1000 * 60 * 60 * 24)
        return daysUntil <= 180 && daysUntil >= 0
      })
      .reduce((sum, i) => sum + (i.estimatedCost ?? 0), 0)

    return {
      next30Days,
      next90Days,
      next6Months
    }
  }, [insights, currentTime])

  const recommendations = useMemo(() => {
    const allRecs = insights.flatMap(i => i.recommendations)
    const uniqueRecs = Array.from(new Set(allRecs))
    
    // Add general recommendations based on patterns
    if (usagePattern.costTrend === "increasing") {
      uniqueRecs.push("Considerar revisão completa para identificar causas do aumento de custos")
    }
    if (healthScore.overall < 70) {
      uniqueRecs.push("Agendar revisão geral - score de saúde baixo")
    }
    
    return uniqueRecs.slice(0, 5) // Limit to top 5
  }, [insights, usagePattern, healthScore])

  const criticalAlerts = useMemo(() => 
    insights.filter(i => i.urgencyScore >= 70)
  , [insights])

  const nextMaintenanceDate = useMemo(() => {
    const upcoming = insights
      .filter(i => i.dueDate && i.dueDate.getTime() > currentTime)
      .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
    
    return upcoming[0]?.dueDate ?? null
  }, [insights, currentTime])

  return {
    insights,
    usagePattern,
    healthScore,
    nextMaintenanceDate,
    projectedCosts,
    recommendations,
    criticalAlerts
  }
}

function getEstimatedCost(maintenanceName: string): number {
  const costs: Record<string, number> = {
    "Troca de Óleo": 150,
    "Pastilhas de Freio": 400,
    "Sistema de Freio": 600,
    "Fluido de Freio/Arrefecimento": 200,
    "Velas de Ignição": 250,
    "Troca de Pneus": 800,
    "Bateria": 350,
    "Filtros": 100,
    "Ajuste de Corrente": 80,
    "Embreagem": 700,
    "Suspensão": 500,
    "Escapamento": 1200
  }
  
  return costs[maintenanceName] ?? 300 // Default cost
}
