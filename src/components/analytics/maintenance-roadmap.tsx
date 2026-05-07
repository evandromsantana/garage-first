import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle2, Circle, ArrowRight } from "lucide-react"

const ROADMAP_STEPS = [
  { km: 1000, label: "REVISÃO INICIAL (AMACIAMENTO)", parts: ["ÓLEO", "FILTRO", "CHECKUP"] },
  { km: 6000, label: "MANUTENÇÃO PERIÓDICA (BÁSICA)", parts: ["ÓLEO", "LUBRIFICAÇÃO"] },
  { km: 12000, label: "SISTEMAS E FLUIDOS (NÍVEL 2)", parts: ["FILTRO AR", "VELAS", "FLUIDO FREIO"] },
  { km: 18000, label: "MANUTENÇÃO PERIÓDICA (BÁSICA)", parts: ["ÓLEO", "FILTRO"] },
  { km: 24000, label: "REVISÃO ESTRUTURAL E VALVULÁRIO", parts: ["AJUSTE VÁLVULAS", "ARREFECIMENTO", "VELAS"] },
  { km: 30000, label: "MANUTENÇÃO PERIÓDICA (BÁSICA)", parts: ["ÓLEO", "KIT RELAÇÃO"] },
  { km: 36000, label: "SISTEMAS E FLUIDOS (NÍVEL 2)", parts: ["FILTRO AR", "VELAS", "SUSPENSÃO"] },
  { km: 42000, label: "MANUTENÇÃO PERIÓDICA (BÁSICA)", parts: ["ÓLEO", "PNEUS"] },
  { km: 48000, label: "REVISÃO ESTRUTURAL E VALVULÁRIO", parts: ["AJUSTE VÁLVULAS", "CHECKUP GERAL"] },
]

export function MaintenanceRoadmap({ currentKm }: { currentKm: number }) {
  return (
    <Card className="kindle-card overflow-hidden">
      <CardHeader className="bg-foreground text-background py-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter italic">
          <BookOpen className="h-8 w-8" /> 
          CRONOGRAMA DE MANUTENÇÃO
        </CardTitle>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          ESPECIFICAÇÕES TÉCNICAS DE FÁBRICA v1.2
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative divide-y-4 divide-foreground">
          {ROADMAP_STEPS.map((step, i) => {
            const isPassed = currentKm >= step.km
            const isNext = !isPassed && (i === 0 || currentKm >= (ROADMAP_STEPS[i-1]?.km ?? 0))

            return (
              <div key={i} className={`group flex items-stretch transition-none ${isPassed ? 'opacity-50' : ''}`}>
                {/* KM Sidebar */}
                <div className={`w-28 border-r-4 border-foreground flex flex-col items-center justify-center p-4 shrink-0
                  ${isPassed ? 'bg-muted' : isNext ? 'bg-foreground text-background' : 'bg-background'}`}>
                  <span className="text-[10px] font-black uppercase mb-1">Status</span>
                  <span className="text-lg font-black font-mono leading-none tracking-tighter">
                    {step.km / 1000}K
                  </span>
                </div>

                {/* Content */}
                <div className="flex-grow p-6 flex items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {isNext && <ArrowRight className="h-5 w-5 animate-in fade-in slide-in-from-left-2 duration-500" />}
                      <h4 className={`text-xl font-black uppercase leading-tight ${isPassed ? 'line-through' : ''}`}>
                        {step.label}
                      </h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {step.parts.map(p => (
                        <span key={p} className="text-[11px] font-black uppercase border-2 border-foreground px-2 py-0.5 bg-background">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isPassed ? (
                      <div className="bg-foreground text-background p-1">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                    ) : isNext ? (
                      <div className="border-4 border-foreground p-1 animate-pulse">
                        <Circle className="h-8 w-8 fill-foreground" />
                      </div>
                    ) : (
                      <Circle className="h-8 w-8 opacity-20" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t-4 border-foreground bg-muted text-center italic font-black uppercase text-[10px] tracking-widest opacity-60">
          AVISO: CONSULTE SEMPRE OS VALORES DE TORQUE ANTES DE INICIAR O PROCEDIMENTO.
        </div>
      </CardContent>
    </Card>
  )
}
