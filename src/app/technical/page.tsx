import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { AlertCircle, Wrench, Settings2, Droplets } from "lucide-react"
import { OEM_PARTS, FLUID_CAPACITIES, DIAGNOSTIC_CODES } from "@/lib/technical-data"

export default function TechnicalCenterPage() {
  return (
    <div className="min-h-screen bg-background font-mono pb-24">
      <PageHeader
        title="Central Técnica"
        icon={<Wrench className="h-6 w-6" />}
      />

      <main className="p-4 space-y-6">
        {/* OEM Part Numbers */}
        <section>
          <div className="flex items-center gap-2 mb-3 border-b-4 border-foreground pb-2">
            <Settings2 className="h-6 w-6" />
            <h2 className="text-xl font-black uppercase">Part Numbers OEM</h2>
          </div>
          <div className="grid gap-2">
            {OEM_PARTS.map((item, i) => (
              <div key={i} className="p-3 border-4 border-foreground bg-background">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black uppercase">{item.name}</span>
                  <span className="font-bold bg-foreground text-background px-2 py-0.5 text-xs">{item.code}</span>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase">{item.spec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fluid Capacities */}
        <section>
          <div className="flex items-center gap-2 mb-3 border-b-4 border-foreground pb-2">
            <Droplets className="h-6 w-6" />
            <h2 className="text-xl font-black uppercase">Capacidades & Fluidos</h2>
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase mb-3">
            Especificações mandatórias do manual de serviço:
          </p>
          <div className="grid gap-2">
            {FLUID_CAPACITIES.map((fluid, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-4 border-foreground shadow-[4px_4px_0_0_var(--foreground)] bg-background group hover:bg-foreground hover:text-background transition-none">
                <div>
                  <p className="font-black uppercase">{fluid.sys}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 group-hover:text-background">{fluid.note}</p>
                </div>
                <span className="font-black text-lg text-right">{fluid.cap}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fault Codes */}
        <section>
          <div className="flex items-center gap-2 mb-3 border-b-4 border-foreground pb-2">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-black uppercase">Diagnóstico (FI Error)</h2>
          </div>
          <Card className="border-4 border-dashed border-foreground rounded-none shadow-none bg-muted">
            <CardContent className="p-4 space-y-3">
              {DIAGNOSTIC_CODES.map((diag, i) => (
                <div key={i} className="flex gap-4 items-start border-b-2 border-foreground/30 pb-3 last:border-0 last:pb-0">
                  <span className="font-black bg-foreground text-background px-2 py-1 text-sm border-2 border-foreground shrink-0 mt-1">
                    {diag.error}
                  </span>
                  <p className="font-bold text-sm leading-tight uppercase relative top-1">
                    {diag.desc}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="pt-6 pb-2 text-center border-t-2 border-dashed border-foreground/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Base of Knowledge: Kawasaki Service Manual EN-2020
          </p>
        </div>
      </main>
    </div>
  )
}
