'use client'

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight } from "lucide-react"

interface WealthAdvisorProps {
  analysis: {
    purchasePrice: number
    marketValue: number
    totalMaintenance: number
    totalUpgrades: number
    totalInvestment: number
    roi: number
    equityRatio: number
    status: 'PROFITABLE' | 'STABLE' | 'DEPRECIATING_HEAVILY'
    recommendation: string
  }
}

export function WealthAdvisor({ analysis }: WealthAdvisorProps) {
  const isGood = analysis.status === 'PROFITABLE'
  const isBad = analysis.status === 'DEPRECIATING_HEAVILY'

  return (
    <Card className="kindle-card bg-foreground text-background overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <DollarSign className="h-24 w-24" />
      </div>
      
      <CardContent className="p-6 space-y-6 relative z-10">
        <div className="flex items-center justify-between border-b-2 border-background/20 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Wealth Advisor Status</p>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">
              {analysis.status.replace('_', ' ')}
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-none border-4 border-background flex items-center justify-center ${isGood ? 'bg-background text-foreground' : ''}`}>
            {isGood ? <TrendingUp className="h-6 w-6" /> : isBad ? <TrendingDown className="h-6 w-6" /> : <Wallet className="h-6 w-6" />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Investimento Total</p>
            <p className="text-xl font-black italic">R$ {analysis.totalInvestment.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Valor de Mercado</p>
            <p className="text-xl font-black italic">R$ {analysis.marketValue.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Manutenção / Upgrades</p>
            <p className="text-sm font-black opacity-80">
              R$ {analysis.totalMaintenance.toLocaleString()} / R$ {analysis.totalUpgrades.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Retenção de Valor</p>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-black ${analysis.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analysis.roi > 0 ? '+' : ''}{analysis.roi.toFixed(1)}%
              </p>
              <ArrowUpRight className={`h-3 w-3 ${analysis.roi >= 0 ? 'rotate-0' : 'rotate-90'}`} />
            </div>
          </div>
        </div>

        <div className="bg-background/10 border-l-4 border-background p-4 mt-4">
          <p className="text-xs font-black uppercase leading-relaxed tracking-tight">
            {analysis.recommendation}
          </p>
        </div>

        <div className="pt-4 flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Equity Ratio</p>
             <div className="h-2 w-32 bg-background/20 border border-background/30">
                <div 
                  className="h-full bg-background" 
                  style={{ width: `${Math.min(100, analysis.equityRatio * 100)}%` }}
                />
             </div>
          </div>
          <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">Ninja Asset Management v1.0</p>
        </div>
      </CardContent>
    </Card>
  )
}
