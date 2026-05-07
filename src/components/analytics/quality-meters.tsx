import { Award, Zap } from "lucide-react"

interface QualityMetersProps {
  oemPercentage: number
  preventivePercentage: number
}

export function QualityMeters({ oemPercentage, preventivePercentage }: QualityMetersProps) {
  return (
    <section className="grid grid-cols-2 gap-6">
      <div className="kindle-card space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
          <Award className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">Pureza (OEM)</h4>
        </div>
        <div className="text-center py-4">
          <span className="text-5xl font-black italic">{oemPercentage}%</span>
          <p className="text-[9px] font-black uppercase opacity-50 mt-2">Peças Originais Instaladas</p>
        </div>
        <div className="h-2 w-full bg-muted border border-foreground">
          <div className="h-full bg-foreground" style={{ width: `${oemPercentage}%` }} />
        </div>
      </div>

      <div className="kindle-card space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
          <Zap className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">Prevenção</h4>
        </div>
        <div className="text-center py-4">
          <span className="text-5xl font-black italic">{preventivePercentage}%</span>
          <p className="text-[9px] font-black uppercase opacity-50 mt-2">Taxa de Manutenção Proativa</p>
        </div>
        <div className="h-2 w-full bg-muted border border-foreground">
          <div className="h-full bg-foreground" style={{ width: `${preventivePercentage}%` }} />
        </div>
      </div>
    </section>
  )
}
