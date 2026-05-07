"use client"

import { Lightbulb, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react"
import { haptics } from "@/lib/haptics"

interface Insight {
  type: 'info' | 'warning' | 'alert' | 'success'
  text: string
}

interface SmartInsightsProps {
  insights: Insight[]
}

export function SmartInsights({ insights }: SmartInsightsProps) {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'info': return <Lightbulb className="h-5 w-5" />
      case 'warning': return <TrendingDown className="h-5 w-5" />
      case 'alert': return <AlertTriangle className="h-5 w-5" />
      case 'success': return <CheckCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
        <Lightbulb className="h-4 w-4" />
        <h3 className="text-xs font-black uppercase tracking-widest">IA Smart Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <div 
            key={i}
            className="flex gap-4 p-5 border-4 border-foreground bg-background shadow-[4px_4px_0_0_var(--foreground)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default"
            onMouseEnter={() => haptics.light()}
          >
            <div className="shrink-0 mt-1">{getIcon(insight.type)}</div>
            <p className="text-sm font-black uppercase leading-tight tracking-tight">
              {insight.text}
            </p>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="col-span-full p-8 border-4 border-dashed border-foreground opacity-30 text-center">
            <p className="text-xs font-black uppercase italic">Nenhuma anomalia detectada pelo sistema</p>
          </div>
        )}
      </div>
    </div>
  )
}
