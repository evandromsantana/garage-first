"use client"

import { Button } from "@/components/ui/button"
import { TechnicalSpec } from "@/types"
import { haptics } from "@/lib/haptics"
import { ninjaVoice } from "@/lib/voice-assistant"

interface SpecsViewerProps {
  vehicleId: string
  specs: TechnicalSpec[]
  onClose: () => void
}

export function SpecsViewer({ vehicleId, specs, onClose }: SpecsViewerProps) {
  const displaySpecs = specs.length > 0 ? specs : [
    { id: "1", component: "Bujão de Óleo", value: "30 Nm", category: "TORQUE", vehicleId: vehicleId, createdAt: new Date(), updatedAt: new Date() },
    { id: "2", component: "Filtro de Óleo", value: "17 Nm", category: "TORQUE", vehicleId: vehicleId, createdAt: new Date(), updatedAt: new Date() },
    { id: "3", component: "Eixo Traseiro", value: "98 Nm", category: "TORQUE", vehicleId: vehicleId, createdAt: new Date(), updatedAt: new Date() },
    { id: "4", component: "Eixo Dianteiro", value: "64 Nm", category: "TORQUE", vehicleId: vehicleId, createdAt: new Date(), updatedAt: new Date() },
  ] as TechnicalSpec[]

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
      <div className="p-4 border-b-4 border-foreground flex items-center justify-between">
        <h2 className="text-xl font-black uppercase italic">Manual de Campo (Specs)</h2>
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={onClose} 
          className="h-14 text-foreground border-2 border-foreground rounded-none"
        >
          FECHAR
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-zinc-100 p-3 border-l-8 border-foreground mb-4">
           <p className="text-[10px] font-black uppercase opacity-60">Dica Ninja</p>
           <p className="text-xs font-black uppercase">Toque no valor para ouvir a especificação via áudio.</p>
        </div>

        {displaySpecs.map((spec) => (
          <div key={spec.id} className="flex justify-between items-center p-5 border-4 border-foreground bg-background shadow-[4px_4px_0_0_var(--foreground)]">
            <div className="flex flex-col">
              <span className="text-[9px] font-black opacity-40 uppercase tracking-tighter">
                {spec.category || "ESPECIFICAÇÃO"}
              </span>
              <span className="font-black uppercase text-lg leading-none">{spec.component}</span>
            </div>
            <button 
              onClick={() => { haptics.heavy(); ninjaVoice.speak(`${spec.component} é ${spec.value}`); }}
              className="font-black bg-foreground text-background text-2xl px-4 py-2 active:scale-95 transition-transform italic"
            >
              {spec.value}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
