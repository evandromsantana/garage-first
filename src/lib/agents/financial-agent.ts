/**
 * Financial Agent - Especialista em custo de propriedade (TCO)
 * Analisa gastos, eficiência por KM e projeções orçamentárias
 */

import { MaintenanceLogSummary } from '@/types'

export interface FinancialMetrics {
  totalSpent: number
  costPerKm: number
  avgTicket: number
  efficiencyScore: number
  projectedYearlyCost: number
}

class FinancialAgent {
  analyze(logs: MaintenanceLogSummary[], currentKm: number): FinancialMetrics {
    const totalSpent = logs.reduce((sum, log) => {
      const logCost = log.cost ?? 0
      const expensesCost = log.expenses?.reduce((s, e) => s + e.itemCost, 0) ?? 0
      return sum + logCost + expensesCost
    }, 0)

    const costPerKm = currentKm > 0 ? totalSpent / currentKm : 0
    const avgTicket = logs.length > 0 ? totalSpent / logs.length : 0
    
    // Projeção baseada na média mensal real
    const firstLogDate = logs.length > 0 
      ? new Date(Math.min(...logs.map(l => new Date(l.createdAt).getTime())))
      : new Date()
    const monthsOwned = Math.max(1, (new Date().getTime() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const monthlyAvg = totalSpent / monthsOwned
    const projectedYearlyCost = monthlyAvg * 12

    // Score de eficiência (menor custo por KM = maior score)
    let efficiencyScore = 100
    if (costPerKm > 0.5) efficiencyScore -= 20
    if (costPerKm > 1.0) efficiencyScore -= 30

    return {
      totalSpent,
      costPerKm,
      avgTicket,
      efficiencyScore,
      projectedYearlyCost
    }
  }

  getSuggestions(metrics: FinancialMetrics): string[] {
    const suggestions: string[] = []
    if (metrics.costPerKm > 0.5) {
      suggestions.push("Custo por KM elevado. Considere manutenções preventivas para reduzir quebras corretivas.")
    }
    if (metrics.avgTicket > 1000) {
      suggestions.push("Ticket médio alto. Verifique a possibilidade de fracionar serviços ou buscar fornecedores OEM.")
    }
    return suggestions
  }
}

export const financialAgent = new FinancialAgent()
