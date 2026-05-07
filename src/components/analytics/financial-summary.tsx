import { TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib"

interface FinancialSummaryProps {
  totalSpent: number
  entryCount: number
}

export function FinancialSummary({ totalSpent, entryCount }: FinancialSummaryProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
        <TrendingUp className="h-4 w-4" />
        <h3 className="text-xs font-black uppercase tracking-widest">Sumário Financeiro</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-px bg-foreground border-4 border-foreground">
        <div className="bg-background p-6 space-y-1">
          <p className="text-[10px] font-black uppercase opacity-50">Total Amortizado</p>
          <p className="text-2xl font-black">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-background p-6 space-y-1 text-right">
          <p className="text-[10px] font-black uppercase opacity-50">Atividade Recente</p>
          <p className="text-2xl font-black">{entryCount} Entradas</p>
        </div>
      </div>
    </section>
  )
}
