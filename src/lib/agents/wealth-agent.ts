import { MaintenanceLog } from "@/types"

export interface WealthAnalysis {
  purchasePrice: number
  marketValue: number
  totalMaintenance: number
  totalUpgrades: number
  totalInvestment: number
  roi: number // Return on Investment (estimated value retention)
  equityRatio: number // Ratio of value vs cost
  status: 'PROFITABLE' | 'STABLE' | 'DEPRECIATING_HEAVILY'
  recommendation: string
}

export const wealthAgent = {
  analyze(
    purchasePrice: number, 
    marketValue: number, 
    logs: MaintenanceLog[]
  ): WealthAnalysis {
    const totalMaintenance = logs
      .filter(l => l.type === 'PREVENTIVE' || l.type === 'CORRECTIVE')
      .reduce((sum, log) => sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0), 0)

    const totalUpgrades = logs
      .filter(l => l.type === 'UPGRADE')
      .reduce((sum, log) => sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0), 0)

    const totalInvestment = purchasePrice + totalMaintenance + totalUpgrades
    
    // Equity Ratio: How much the bike is worth vs how much you put in
    const equityRatio = marketValue / totalInvestment
    
    // ROI: Value retention since purchase
    const roi = ((marketValue - purchasePrice) / purchasePrice) * 100

    let status: WealthAnalysis['status'] = 'STABLE'
    let recommendation = ""

    if (equityRatio > 0.8) {
      status = 'PROFITABLE'
      recommendation = "Sua moto é um excelente ativo. O valor de mercado cobre quase todo o seu investimento total."
    } else if (equityRatio < 0.4) {
      status = 'DEPRECIATING_HEAVILY'
      recommendation = "Cuidado: Seus custos superaram o valor do ativo. Considere reduzir upgrades e focar apenas no essencial."
    } else {
      status = 'STABLE'
      recommendation = "Equilíbrio saudável entre uso e manutenção. Continue monitorando os gastos fixos."
    }

    if (totalUpgrades > marketValue * 0.2) {
      recommendation += " Você investiu muito em modificações que podem não ser recuperadas na venda."
    }

    return {
      purchasePrice,
      marketValue,
      totalMaintenance,
      totalUpgrades,
      totalInvestment,
      roi,
      equityRatio,
      status,
      recommendation
    }
  }
}
