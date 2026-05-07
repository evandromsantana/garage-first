"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleHealthScore } from "@/types"
import { ClipboardCheck, Check, AlertTriangle } from "lucide-react"

export function VehicleSkeleton({ health }: { health?: VehicleHealthScore }) {
  const InspectionItem = ({ label, score }: { label: string, score?: number }) => {
    // Se não houver score, mostra o estado de carregamento
    if (score === undefined) {
      return (
        <div className="flex items-center justify-between py-3 border-b-2 border-foreground/10 last:border-0">
          <div className="flex flex-col gap-2">
            <div className="h-2 w-24 bg-muted animate-pulse" />
            <div className="h-4 w-32 bg-muted animate-pulse" />
          </div>
          <div className="h-6 w-12 bg-muted animate-pulse" />
        </div>
      )
    }

    const isCritical = score < 60
    const isWarning = score < 80 && score >= 60

    return (
      <div className="flex items-center justify-between py-3 border-b-2 border-foreground/10 last:border-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{label}</span>
          <div className="flex items-center gap-2">
            {isCritical ? (
              <AlertTriangle className="h-4 w-4 text-foreground" />
            ) : (
              <Check className="h-4 w-4 text-foreground" />
            )}
            <span className="text-sm font-black uppercase italic">{isCritical ? 'Revisão Necessária' : isWarning ? 'Atenção em Breve' : 'Estado Nominal'}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black italic">{Math.round(score)}%</span>
        </div>
      </div>
    )
  }

  return (
    <Card className="kindle-card">
      <CardHeader className="pb-4 border-b-4 border-foreground">
        <CardTitle className="text-xl font-black uppercase flex items-center gap-2 italic">
          <ClipboardCheck className="h-6 w-6" />
          Relatório de Inspeção
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-0">
        <InspectionItem label="Motor & Transmissão" score={health?.engine} />
        <InspectionItem label="Sistema de Freios" score={health?.brakes} />
        <InspectionItem label="Pneus & Tração" score={health?.tires} />
        <InspectionItem label="Eletrônica Central" score={health?.electronics} />
        
        <div className="mt-4 p-4 border-4 border-foreground bg-foreground/5 flex items-center justify-between">
           <span className="text-[10px] font-black uppercase tracking-widest">Score de Integridade</span>
           {health ? (
             <span className="text-2xl font-black italic">82.4</span>
           ) : (
             <div className="h-8 w-16 bg-muted animate-pulse" />
           )}
        </div>
      </CardContent>
    </Card>
  )
}
