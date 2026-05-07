"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Check, Hand, Play, Wrench } from "lucide-react"

interface MainMenuProps {
  onShowGuides: () => void
  onShowChecklist: (type: string) => void
  onShowTorques: () => void
  onPhotoCapture: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
}

export function MainMenu({ 
  onShowGuides, 
  onShowChecklist, 
  onShowTorques, 
  onPhotoCapture,
  onClose 
}: MainMenuProps) {
  return (
    <div className="flex-1 flex flex-col font-mono">
      <div className="p-5 border-b-4 border-foreground flex items-center justify-between shadow-[0_4px_0_0_var(--foreground)] z-10 bg-background">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-foreground text-background flex items-center justify-center">
            <Hand className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Oficina</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="h-14 px-6 text-xl font-black rounded-none border-4 border-foreground shadow-[4px_4px_0_0_var(--foreground)]"
        >
          SAIR
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <p className="text-lg font-bold text-foreground text-center mb-6 uppercase border-b-2 border-dashed border-foreground/30 pb-2">
          [ Acesso Rápido - Luva Mode ]
        </p>
        <div className="grid gap-4">
          <Button 
            size="lg" 
            className="h-28 text-2xl font-black rounded-none border-4 border-foreground bg-foreground text-background shadow-[4px_4px_0_0_var(--foreground)]" 
            onClick={onShowGuides}
          >
            <Play className="h-10 w-10 mr-3 fill-current" />
            GUIAS DE SERVIÇO
          </Button>
          
          <Button 
            size="lg" 
            className="h-28 text-2xl font-black rounded-none border-4 border-foreground bg-white text-foreground shadow-[4px_4px_0_0_var(--foreground)]" 
            onClick={() => onShowChecklist("PREVENTIVA")}
          >
            <Check className="h-10 w-10 mr-3" />
            PREVENTIVA RÁPIDA
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
             <Button 
               size="lg" 
               className="h-28 text-xl font-black rounded-none border-4 border-foreground bg-muted text-foreground shadow-[4px_4px_0_0_var(--foreground)] flex-col" 
               onClick={onShowTorques}
             >
               <Wrench className="h-8 w-8 mb-1" />
               TORQUES
             </Button>
             
             <div className="relative">
               <Input 
                 type="file" 
                 accept="image/*" 
                 capture="environment" 
                 onChange={onPhotoCapture} 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
               />
               <Button 
                 variant="outline" 
                 size="lg" 
                 className="w-full h-28 text-xl font-black rounded-none border-4 border-foreground bg-white text-foreground shadow-[4px_4px_0_0_var(--foreground)] flex-col"
               >
                 <Camera className="h-8 w-8 mb-1" />
                 FOTO
               </Button>
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t-4 border-foreground bg-muted text-center font-black uppercase tracking-widest">
        Ninja 400 • E-INK WORKSHOP
      </div>
    </div>
  )
}
