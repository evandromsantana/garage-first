"use client"

import { Button } from "@/components/ui/button"
import { Check, Play } from "lucide-react"
import { ServiceGuide } from "@/lib/constants/guides"
import { haptics } from "@/lib/haptics"
import { ninjaVoice } from "@/lib/voice-assistant"

interface GuideDetailProps {
  guide: ServiceGuide
  checkedItems: Record<string, boolean>
  onToggleCheck: (item: string) => void
  onComplete: () => void
  onBack: () => void
}

export function GuideDetail({ 
  guide, 
  checkedItems, 
  onToggleCheck, 
  onComplete, 
  onBack 
}: GuideDetailProps) {
  const allChecked = guide.steps.every(step => checkedItems[step.text])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
      <div className="p-4 border-b-4 border-foreground flex items-center justify-between bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <Play className="h-6 w-6 text-green-500 fill-green-500" />
          <h2 className="text-lg font-black uppercase leading-tight">{guide.title}</h2>
        </div>
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="h-10 text-white border-2 border-white/20 rounded-none"
        >
          VOLTAR
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
         {guide.steps.map((step, idx) => {
           const isChecked = checkedItems[step.text]
           return (
             <div 
               key={idx} 
               className={`border-4 p-4 transition-all ${isChecked ? 'border-foreground bg-zinc-100 opacity-60' : 'border-foreground bg-white shadow-[4px_4px_0_0_var(--foreground)]'}`}
             >
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => onToggleCheck(step.text)} 
                    className={`h-12 w-12 border-4 border-foreground shrink-0 flex items-center justify-center ${isChecked ? 'bg-foreground text-background' : 'bg-white'}`}
                  >
                    {isChecked && <Check className="h-8 w-8 font-black" />}
                  </button>
                  <div className="space-y-1">
                     <p className={`text-lg font-black uppercase leading-tight ${isChecked ? 'line-through' : ''}`}>
                       {step.text}
                     </p>
                     <div className="flex flex-wrap gap-2 pt-1">
                        {step.tool !== "N/A" && (
                          <span className="text-[9px] font-black bg-zinc-200 px-2 py-0.5 border border-foreground/20">
                            🔧 {step.tool}
                          </span>
                        )}
                        {step.torque && (
                          <button 
                            onClick={() => { haptics.heavy(); ninjaVoice.announceTorque(step.text, step.torque!); }}
                            className="text-[9px] font-black bg-foreground text-background px-2 py-0.5 active:scale-95"
                          >
                            ⚡ TORQUE: {step.torque}
                          </button>
                        )}
                     </div>
                  </div>
                </div>
             </div>
           )
         })}
      </div>

      <div className="p-4 border-t-4 border-foreground bg-muted fixed bottom-0 left-0 right-0">
         <Button 
           size="lg" 
           disabled={!allChecked} 
           onClick={onComplete} 
           className={`w-full h-16 text-xl font-black uppercase rounded-none border-4 border-foreground shadow-[4px_4px_0_0_var(--foreground)] ${allChecked ? 'bg-foreground text-background' : 'opacity-20 cursor-not-allowed'}`}
         >
           CONCLUIR E REGISTRAR
         </Button>
      </div>
    </div>
  )
}
