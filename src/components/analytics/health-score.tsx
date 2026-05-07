"use client"

import { haptics } from "@/lib/haptics"

interface HealthScoreProps {
  score: number
}

export function HealthScore({ score }: HealthScoreProps) {
  const getLabel = () => {
    if (score >= 90) return "IMPECÁVEL"
    if (score >= 70) return "CONSERVADO"
    if (score >= 50) return "ATENÇÃO"
    return "CRÍTICO"
  }

  const getColor = () => {
    if (score >= 90) return "bg-foreground"
    if (score >= 70) return "bg-zinc-800"
    if (score >= 50) return "bg-zinc-600"
    return "bg-zinc-400"
  }

  return (
    <div 
      className="kindle-card flex flex-col items-center justify-center py-10 space-y-4 cursor-help group transition-all"
      onMouseEnter={() => haptics.light()}
    >
      <div className="relative w-40 h-40 flex items-center justify-center border-8 border-foreground rounded-full shadow-[6px_6px_0_0_var(--foreground)] group-hover:scale-105 transition-transform">
        <span className="text-6xl font-black italic">{score}</span>
        <span className="absolute bottom-6 text-[10px] font-black uppercase opacity-40">PTS</span>
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Status de Auditoria</p>
        <p className="text-2xl font-black uppercase tracking-tighter italic">{getLabel()}</p>
      </div>

      <div className="w-full max-w-[200px] h-4 bg-muted border-2 border-foreground overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
