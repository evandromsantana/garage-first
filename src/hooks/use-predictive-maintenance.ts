"use client"

import { ALERT_THRESHOLD_KM, PREDICTIVE_RULES } from "@/lib/constants/maintenance"
import { MaintenanceLog, MaintenanceType, PredictiveInsight, UsagePattern, VehicleHealthScore } from "@/types"
import { useEffect, useMemo, useState } from "react"

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

export function usePredictiveMaintenance(
  initialLogs: MaintenanceLog[] = [], 
  currentKm: number = 0,
  customRules: any[] = []
): UsePredictiveMaintenanceReturn {
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const maintenanceLogs = useMemo(() => Array.isArray(initialLogs) ? initialLogs : [], [initialLogs])
  
  // 1. Define as regras ativas (customizadas ou padrão) para todo o hook
  const activeRules = useMemo(() => {
    return customRules.length > 0 
      ? customRules.map(r => ({
          name: r.name,
          keyword: r.name,
          lifespan: r.intervalKm,
          criticality: r.criticality,
          category: r.category || 'general'
        }))
      : PREDICTIVE_RULES
  }, [customRules])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const insights = useMemo(() => {
    const insights: PredictiveInsight[] = []

    // Analyze each maintenance type based on rules
    activeRules.forEach(rule => {
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
        const multipliers: Record<string, number> = {
          low: 0.7,
          medium: 1.0,
          high: 1.3,
          critical: 1.6
        }
        const criticalityMultiplier = multipliers[rule.criticality as string] || 1.0
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

    // Deduplicar insights pelo nome, mantendo o de maior urgência
    const uniqueInsightsMap = new Map<string, PredictiveInsight>()
    insights.forEach(insight => {
      const existing = uniqueInsightsMap.get(insight.name)
      if (!existing || insight.urgencyScore > existing.urgencyScore) {
        uniqueInsightsMap.set(insight.name, insight)
      }
    })

    return Array.from(uniqueInsightsMap.values()).sort((a, b) => b.urgencyScore - a.urgencyScore)
  }, [maintenanceLogs, currentKm, currentTime])

  const usagePattern = useMemo(() => {
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

    // AI Predictive Riding Style logic
    let ridingStyle = "COMMUTE"
    if (averageKmPerMonth > 2000) {
      ridingStyle = "TOURING"
    } else {
      // Check if brakes/tires are replaced very often (indicating Track/Aggressive)
      const brakeLogs = sortedLogs.filter(l => l.description.toLowerCase().includes('pastilha') || l.description.toLowerCase().includes('freio'))
      if (brakeLogs.length >= 2) {
        const firstBrake = brakeLogs[0]
        const secondBrake = brakeLogs[1]
        
        if (firstBrake && secondBrake) {
          const brakeKmDiff = secondBrake.kmAtService - firstBrake.kmAtService
          if (brakeKmDiff > 0 && brakeKmDiff < 5000) {
            ridingStyle = "TRACK_DAY"
          } else if (brakeKmDiff < 8000) {
            ridingStyle = "AGGRESSIVE"
          }
        }
      }
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
      ridingStyle, // Added to usagePattern
      peakUsageMonth: null // Simplified
    }
  }, [maintenanceLogs])

  const healthScore = useMemo(() => {
    const categoryScores: Record<string, number> = {
      engine: 100,
      brakes: 100,
      tires: 100,
      electronics: 100,
      general: 100
    }

    // Calculate scores based on overdue maintenance
    insights.forEach(insight => {
      const rule = activeRules.find(r => r.name === insight.name)
      if (rule && rule.lifespan && insight.dueKm && currentKm > insight.dueKm) {
        const overdueKm = currentKm - insight.dueKm
        const penalty = Math.min(50, (overdueKm / rule.lifespan) * 50)
        const category = rule.category as string
        if (category && category in categoryScores) {
          const currentScore = categoryScores[category] ?? 100
          categoryScores[category] = Math.max(0, currentScore - penalty)
        }
      }
    })

    const overall = Object.values(categoryScores).reduce((a, b) => a + b, 0) / 5

    return {
      overall,
      engine: categoryScores['engine'] ?? 100,
      brakes: categoryScores['brakes'] ?? 100,
      tires: categoryScores['tires'] ?? 100,
      electronics: categoryScores['electronics'] ?? 100,
      lastUpdated: new Date(),
      trend: "stable" as const
    }
  }, [maintenanceLogs, currentKm, insights, activeRules])

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
