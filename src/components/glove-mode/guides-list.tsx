"use client"

import { Button } from "@/components/ui/button"
import { SERVICE_GUIDES, ServiceGuide } from "@/lib/constants/guides"
import { haptics } from "@/lib/haptics"
import { ninjaVoice } from "@/lib/voice-assistant"

interface GuidesListProps {
  onSelectGuide: (guide: ServiceGuide) => void
  onClose: () => void
}

export function GuidesList({ onSelectGuide, onClose }: GuidesListProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
      <div className="p-4 border-b-4 border-foreground flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase">Manuais Interativos</h2>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="border-4 border-foreground font-black rounded-none"
        >
          FECHAR
        </Button>
      </div>
      <div className="p-4 grid gap-4 overflow-y-auto">
         {Object.entries(SERVICE_GUIDES).map(([id, guide]) => (
           <Button 
             key={id} 
             onClick={() => { 
               haptics.light(); 
               onSelectGuide(guide); 
               ninjaVoice.speak(`Iniciando manual: ${guide.title}. Boa manutenção.`);
             }} 
             className="h-24 flex flex-col items-start justify-center border-4 border-foreground bg-white text-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground hover:text-background transition-none"
           >
              <span className="text-lg font-black uppercase">{guide.title}</span>
              <span className="text-[10px] font-bold opacity-60 uppercase">
                DIFICULDADE: {guide.difficulty} • {guide.estimatedTime}
              </span>
           </Button>
         ))}
      </div>
    </div>
  )
}
