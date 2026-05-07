import { AlertCircle, Wrench } from "lucide-react"

interface DiagnosisResultProps {
  diagnosis: {
    likelyCause: string
    severity: "low" | "medium" | "high"
    recommendation: string
  }
}

export function DiagnosisResult({ diagnosis }: DiagnosisResultProps) {
  return (
    <div className="border-4 border-foreground rounded-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className={`p-2 border-b-4 border-foreground text-center font-black uppercase text-[10px] tracking-widest
        ${diagnosis.severity === 'high' ? 'bg-foreground text-background' : 'bg-muted'}`}>
        Relatório de Diagnóstico: {diagnosis.severity === 'high' ? 'ALTA CRITICIDADE' : 'NORMAL'}
      </div>
      <div className="p-4 space-y-4 bg-background">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4" />
            <span className="font-black uppercase text-[11px]">Causa Provável</span>
          </div>
          <p className="text-lg font-black uppercase leading-tight italic">{diagnosis.likelyCause}</p>
        </div>
        
        <div className="pt-3 border-t-2 border-dashed border-foreground/30">
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="h-4 w-4" />
            <span className="font-black uppercase text-[11px]">Procedimento Técnico</span>
          </div>
          <p className="text-sm font-bold leading-relaxed">{diagnosis.recommendation}</p>
        </div>
      </div>
    </div>
  )
}
