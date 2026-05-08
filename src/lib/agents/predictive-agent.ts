/**
 * Predictive Agent - Especialista em análise de falhas e manutenção preventiva
 * Analisa padrões de uso e logs históricos para prever substituições
 */

import { MaintenanceLogSummary, PredictiveInsight } from '@/types'

export interface PredictiveMetrics {
  healthScore: number
  criticalIssues: number
  nextMajorService: string | null
  insights: PredictiveInsight[]
}

class PredictiveAgent {
  // Analisa os logs e KM atual para gerar métricas preditivas
  analyze(logs: MaintenanceLogSummary[], currentKm: number, customRules?: any[]): PredictiveMetrics {
    const insights: PredictiveInsight[] = []
    let criticalIssues = 0
    
    // Usa regras customizadas se disponíveis, senão usa os padrões do sistema
    const rules = customRules && customRules.length > 0 
      ? customRules.map(r => ({ name: r.name, interval: r.intervalKm, criticality: r.criticality }))
      : [
          { name: 'Óleo do Motor', interval: 5000, criticality: 'high' },
          { name: 'Filtro de Óleo', interval: 5000, criticality: 'medium' },
          { name: 'Fluido de Freio', interval: 10000, criticality: 'high' },
          { name: 'Relação (Corrente/Pinhão)', interval: 20000, criticality: 'critical' },
          { name: 'Pneus', interval: 15000, criticality: 'high' },
        ]

    rules.forEach(rule => {
      const lastService = logs
        .filter(l => l.description.toLowerCase().includes(rule.name.toLowerCase()))
        .sort((a, b) => b.kmAtService - a.kmAtService)[0]

      const kmSinceLast = lastService ? currentKm - lastService.kmAtService : currentKm
      const status = kmSinceLast / rule.interval

      if (status > 0.8) {
        if (status >= 1.0) criticalIssues++
        
        insights.push({
          name: rule.name,
          dueDate: new Date(), // Simulado para o agente
          dueKm: rule.interval + (lastService?.kmAtService || 0),
          urgencyScore: status >= 1.0 ? 100 : status * 100,
          criticality: rule.criticality as "low" | "medium" | "high" | "critical",
          recommendations: [`Substituir ${rule.name} imediatamente.`]
        })
      }
    })

    const healthScore = Math.max(0, 100 - (criticalIssues * 15))

    return {
      healthScore,
      criticalIssues,
      nextMajorService: insights[0]?.name || null,
      insights
    }
  }

  // Gera sugestões baseadas na análise
  getSuggestions(metrics: PredictiveMetrics): string[] {
    return metrics.insights.map(i => `${i.name}: ${i.recommendations[0]}`)
  }
}

export const predictiveAgent = new PredictiveAgent()
