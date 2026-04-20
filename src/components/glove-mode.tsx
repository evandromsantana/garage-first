"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Hand, ChevronLeft, Plus, Camera, Check, Wrench } from "lucide-react"
import { toast } from "sonner"

interface GloveModeProps {
  vehicleId: string
  onClose: () => void
  onQuickLog: (type: string) => void
}

export function GloveMode({ vehicleId, onClose, onQuickLog }: GloveModeProps) {
  const [checklistActive, setChecklistActive] = useState<string | null>(null)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [showTorques, setShowTorques] = useState(false)

  const CHECKLISTS: Record<string, { title: string; items: string[] }> = {
    PREVENTIVA: {
      title: "CHECKLIST PREVENTIVA",
      items: [
        "LIMPAR E LUBRIFICAR CORRENTE",
        "CALIBRAR PNEUS (D:28 / T:32)",
        "CHECAR NÍVEL DE ÓLEO",
        "CHECAR FLUIDO DE FREIO",
        "VERIFICAR LUZES / SETAS"
      ]
    },
    OLEO: {
      title: "TROCA DE ÓLEO (10W40)",
      items: [
        "AQUECER O MOTOR (3 MIN)",
        "DRENAR ÓLEO ANTIGO",
        "SUBSTITUIR FILTRO DE ÓLEO",
        "INSERIR 2.0L DE ÓLEO NOVO",
        "TORQUE NO BUJÃO (30 Nm) E FILTRO"
      ]
    },
    LAVAGEM: {
      title: "LAVAGEM TÁTICA",
      items: [
        "DESENGRAXAR RELAÇÃO E CORRENTE",
        "LAVAR CARENAGENS",
        "SECAR MOTO COMPLETAMENTE",
        "LUBRIFICAR CORRENTE (MOTUL C4)",
        "REVITALIZAR PLÁSTICOS NEGROS"
      ]
    }
  }

  const handleToggleCheck = (item: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50)
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }))
  }

  const handleCompleteChecklist = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100])
    const title = checklistActive ? CHECKLISTS[checklistActive].title : "Checklist"
    toast.success(`${title} Concluída!`)
    onQuickLog(title)
    setChecklistActive(null)
    setCheckedItems({})
  }

  const handleQuickAction = (action: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50)
    toast.success(`${action} registrado!`)
    onQuickLog(action)
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100)
      toast.success("Foto anexada ao serviço atual!")
      // In a real app we would upload this File to S3/Cloudinary here.
    }
  }

  if (showTorques) {
    const TORQUES = [
      { part: "Bujão de Óleo", value: "30 Nm" },
      { part: "Filtro de Óleo", value: "17 Nm" },
      { part: "Eixo Traseiro (Corrente)", value: "98 Nm" },
      { part: "Eixo Dianteiro", value: "64 Nm" },
      { part: "Pinça de Freio", value: "25 Nm" },
      { part: "Velas de Ignição", value: "13 Nm" },
    ]
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
        <div className="p-4 border-b-4 border-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-foreground" />
            <h2 className="text-xl font-black uppercase text-foreground">Torques Oficiais</h2>
          </div>
          <Button variant="ghost" size="lg" onClick={() => setShowTorques(false)} className="h-14 text-foreground hover:bg-foreground hover:text-background rounded-none border-2 border-transparent focus:ring-0">
            FECHAR
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
          <p className="text-sm font-bold text-muted-foreground uppercase text-center mb-6">Mecânica de Precisão Ninja 400</p>
          {TORQUES.map((t, idx) => (
            <div key={idx} className="w-full flex items-center justify-between p-4 border-4 border-foreground bg-background shadow-[4px_4px_0_0_colord(var(--foreground))]">
              <span className="text-[14px] font-black uppercase">{t.part}</span>
              <span className="text-xl font-black bg-foreground text-background px-3 py-1 border-2 border-foreground">{t.value}</span>
            </div>
          ))}
          <div className="mt-8 p-4 border-2 border-dashed border-foreground/50 bg-muted">
            <p className="text-xs font-bold uppercase text-center">Atenção: Use paquímetro para folga de corrente (25-35mm) e torquímetro calibrado.</p>
          </div>
        </div>
      </div>
    )
  }

  if (checklistActive && CHECKLISTS[checklistActive]) {
    const activeData = CHECKLISTS[checklistActive]
    const allChecked = activeData.items.every(item => checkedItems[item])
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
        <div className="p-4 border-b-4 border-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-8 w-8 text-foreground" />
            <h2 className="text-xl font-black uppercase text-foreground">{activeData.title}</h2>
          </div>
          <Button variant="ghost" size="lg" onClick={() => { setChecklistActive(null); setCheckedItems({}); }} className="h-14 text-foreground hover:bg-foreground hover:text-background rounded-none border-2 border-transparent">
            CANCELAR
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {activeData.items.map((item, idx) => {
            const isChecked = checkedItems[item]
            return (
              <Button
                key={idx}
                variant={isChecked ? "default" : "outline"}
                className={`w-full h-24 flex items-center justify-start px-4 rounded-none border-4 ${isChecked ? 'bg-foreground text-background border-foreground shadow-[inset_4px_4px_0_0_var(--background)]' : 'bg-background text-foreground border-foreground shadow-[4px_4px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none'} transition-all`}
                onClick={() => handleToggleCheck(item)}
              >
                <div className={`h-8 w-8 border-4 border-current mr-4 flex items-center justify-center shrink-0 ${isChecked ? 'bg-background text-foreground' : 'bg-transparent'}`}>
                  {isChecked && <Check className="h-6 w-6 font-black" />}
                </div>
                <span className="text-[15px] font-black uppercase whitespace-normal text-left leading-tight">
                  {item}
                </span>
              </Button>
            )
          })}
        </div>
        
        <div className="p-4 border-t-4 border-foreground bg-muted fixed bottom-0 left-0 right-0 z-10 w-full">
          <Button 
            size="lg" 
            disabled={!allChecked}
            className={`w-full h-16 text-2xl font-black uppercase rounded-none border-4 border-foreground transition-all ${allChecked ? 'bg-foreground text-background shadow-[4px_4px_0_0_colord(var(--foreground))] hover:scale-[0.98]' : 'opacity-50 cursor-not-allowed hidden'}`}
            onClick={handleCompleteChecklist}
          >
            FINALIZAR REGISTRO
          </Button>
          {!allChecked && (
            <p className="text-center font-bold text-muted-foreground uppercase py-4">
              [ COMPLETE OS PASSOS ACIMA ]
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
      {/* Header */}
      <div className="p-5 border-b-4 border-foreground flex items-center justify-between shadow-[0_4px_0_0_var(--foreground)] z-10 bg-background">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-foreground text-background flex items-center justify-center">
            <Hand className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Oficina</h1>
        </div>
        <Button variant="outline" onClick={onClose} className="h-14 px-6 text-xl font-black rounded-none border-4 border-foreground hover:bg-foreground hover:text-background transition-none shadow-[4px_4px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none">
          <ChevronLeft className="h-6 w-6 mr-1" />
          SAIR
        </Button>
      </div>

      {/* Ações Rápidas - Botões Grandes para Luvas */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <p className="text-lg font-bold text-foreground text-center mb-6 uppercase border-b-2 border-dashed border-foreground/30 pb-2">
          [ Acesso Rápido - Auto Contraste ]
        </p>

        <div className="grid gap-4">
          <Button 
            size="lg" 
            className="h-28 text-2xl font-black rounded-none border-4 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-none shadow-[4px_4px_0_0_colord(var(--foreground))]"
            onClick={() => setChecklistActive("OLEO")}
          >
            <Plus className="h-10 w-10 mr-3" />
            TROCA DE ÓLEO
          </Button>

          <Button 
            size="lg" 
            className="h-28 text-2xl font-black rounded-none border-4 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-none shadow-[4px_4px_0_0_colord(var(--foreground))]"
            onClick={() => setChecklistActive("PREVENTIVA")}
          >
            <Check className="h-10 w-10 mr-3" />
            CHECKLIST PREVENTIVA
          </Button>

          <Button 
            size="lg" 
            className="h-28 text-2xl font-black rounded-none border-4 border-foreground bg-muted text-foreground hover:bg-foreground hover:text-background transition-none shadow-[4px_4px_0_0_colord(var(--foreground))]"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50)
              setShowTorques(true)
            }}
          >
            <Wrench className="h-10 w-10 mr-3" />
            TABELA DE TORQUE
          </Button>

          <Button 
            size="lg" 
            className="h-28 text-2xl font-black rounded-none border-4 border-dashed border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-none shadow-[4px_4px_0_0_colord(var(--foreground))]"
            onClick={() => handleQuickAction("Upgrade")}
          >
            <Plus className="h-10 w-10 mr-3" />
            UPGRADE
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-24 text-xl font-black rounded-none border-4 border-foreground hover:bg-foreground hover:text-background transition-none shadow-[4px_4px_0_0_colord(var(--foreground))]"
            >
              <Camera className="h-8 w-8 mr-2" />
              FOTO
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="lg" 
            className="h-24 text-xl font-black rounded-none border-4 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-none shadow-[4px_4px_0_0_colord(var(--foreground))]"
            onClick={() => setChecklistActive("LAVAGEM")}
          >
            <Check className="h-8 w-8 mr-2" />
            LAVAGEM
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t-4 border-foreground bg-muted font-mono">
        <p className="text-base text-center font-bold text-foreground uppercase tracking-widest">
          Ninja 400 • E-INK MODE
        </p>
      </div>
    </div>
  )
}
