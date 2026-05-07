"use client"

import { submitFullMaintenance } from "@/app/actions"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MAINTENANCE_TYPE_LABELS, TYPE_SUGGESTIONS } from "@/lib/constants/maintenance"
import { haptics } from "@/lib/haptics"
import { InventoryItem, MaintenanceType, PartInput } from "@/types"
import { Wrench } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PartList } from "./part-list"

interface Part extends PartInput {
  id: string;
}

export default function NewMaintenanceForm({ 
  vehicleId, 
  initialKm,
  inventory = []
}: { 
  vehicleId: string, 
  initialKm: number,
  inventory?: InventoryItem[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<MaintenanceType>('PREVENTIVE')
  const [description, setDescription] = useState("")
  const [km, setKm] = useState(initialKm)
  const [parts, setParts] = useState<Part[]>([])

  // Verificar se há dados não salvos
  const hasUnsavedData = description.trim() !== '' || parts.length > 0

  // Confirmação ao sair com dados não salvos
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedData])

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Informe uma descrição para o serviço")
      return
    }

    const validKm = isNaN(km) ? initialKm : km
    setLoading(true)
    try {
      await submitFullMaintenance({
        vehicleId,
        type,
        description,
        kmAtService: validKm,
        parts: parts.filter(p => p.name.trim() !== '')
      })
      haptics.success()
      toast.success("Serviço registrado com sucesso!")
      router.push('/')
    } catch {
      haptics.error()
      toast.error("Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    haptics.light()
    setDescription(suggestion)
  }

  return (
    <div className="min-h-screen bg-background font-mono pb-24">
      <PageHeader
        title="Registrar Serviço"
        icon={<Wrench className="h-6 w-6" />}
      />

      <main className="p-4 space-y-6 max-w-lg mx-auto">
        <Card className="bg-card border-4 border-foreground rounded-none shadow-none">
          <CardContent className="p-4 space-y-4">
             <div className="space-y-3">
              <Label className="font-black uppercase tracking-widest text-[10px] opacity-60">Tipo de Serviço</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['PREVENTIVE', 'CORRECTIVE', 'UPGRADE'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      haptics.light()
                      setType(t)
                    }}
                    className={`h-14 text-[10px] font-black uppercase tracking-tighter border-4 rounded-none transition-none flex flex-col items-center justify-center gap-1 ${
                                 type === t
                                 ? "bg-foreground text-background border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]"
                                 : "bg-background text-foreground border-foreground hover:bg-foreground/5"
                               }`}
                  >
                    <span className="text-xs">{t === 'PREVENTIVE' ? '🛡️' : t === 'CORRECTIVE' ? '🔧' : '🚀'}</span>
                    {MAINTENANCE_TYPE_LABELS[t].substring(0, 4)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-black uppercase tracking-widest text-[10px] opacity-60">Resumo do Serviço</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Troca de Óleo e Filtro"
                className="border-4 border-foreground rounded-none h-14 font-black uppercase text-sm placeholder:opacity-30"
              />
              {/* Sugestões por tipo */}
              <div className="flex flex-wrap gap-2 pt-1">
                {TYPE_SUGGESTIONS[type].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => applySuggestion(suggestion)}
                    className="text-[10px] px-3 py-2 border-2 border-foreground/30 rounded-none hover:bg-foreground hover:text-background transition-none font-black uppercase tracking-tighter"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-black uppercase tracking-widest text-[10px] opacity-60">Odômetro (KM)</Label>
              <Input 
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                type="number" 
                className="border-4 border-foreground rounded-none h-16 font-black text-2xl" 
              />
            </div>

          </CardContent>
        </Card>

        {/* Módulo de Peças Modularizado */}
        <PartList parts={parts} setParts={setParts} inventory={inventory} />

        <Button 
          onClick={handleSubmit}
          disabled={loading || !description}
          className="w-full h-16 font-black text-lg uppercase tracking-widest border-4 border-background shadow-[0_0_0_4px_var(--foreground)] rounded-none hover:bg-background hover:text-foreground hover:scale-[0.99] transition-transform mt-8"
        >
          {loading ? "PROCESSANDO..." : "SALVAR SERVIÇO"}
        </Button>
      </main>
    </div>
  )
}
