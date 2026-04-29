"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { submitFullMaintenance } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Wrench } from "lucide-react"
import { toast } from "sonner"
import { MaintenanceType, PartInput } from "@/types"
import { MAINTENANCE_TYPE_LABELS, TYPE_SUGGESTIONS } from "@/lib/constants/maintenance"
import { formatCurrency } from "@/lib"
import { PageHeader } from "@/components/page-header"

interface Part extends PartInput {
  id: string;
}

export default function NewMaintenanceForm({ vehicleId, initialKm }: { vehicleId: string, initialKm: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<MaintenanceType>('PREVENTIVE')
  const [description, setDescription] = useState("")
  const [km, setKm] = useState(initialKm)
  const [parts, setParts] = useState<Part[]>([])

  // Cálculo do total em tempo real
  const totalCost = useMemo(() => {
    return parts.reduce((sum, part) => sum + (part.cost || 0), 0)
  }, [parts])

  const addPart = () => {
    setParts([...parts, { id: crypto.randomUUID(), name: "", cost: 0, isOriginal: false }])
  }

  const updatePart = (id: string, field: keyof Part, value: string | number | boolean) => {
    setParts(parts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const removePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id))
  }

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

    setLoading(true)
    try {
      await submitFullMaintenance({
        vehicleId,
        type,
        description,
        kmAtService: km,
        parts: parts.filter(p => p.name.trim() !== '')
      })
      toast.success("Serviço registrado com sucesso!")
      router.push('/')
    } catch {
      toast.error("Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
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
            
            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-wider text-xs">Tipo de Serviço</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['PREVENTIVE', 'CORRECTIVE', 'UPGRADE'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`h-10 text-[10px] font-black uppercase tracking-widest border-2 rounded-none transition-none ${
                                type === t
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-foreground border-foreground hover:bg-foreground/10"
                              }`}
                  >
                    {MAINTENANCE_TYPE_LABELS[t].substring(0, 4)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-wider text-xs">Resumo do Serviço</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Troca de Óleo e Filtro"
                className="border-2 border-foreground rounded-none h-12 font-bold uppercase"
              />
              {/* Sugestões por tipo */}
              <div className="flex flex-wrap gap-1 pt-1">
                {TYPE_SUGGESTIONS[type].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => applySuggestion(suggestion)}
                    className="text-[10px] px-2 py-1 border border-foreground/30 rounded-none hover:bg-foreground hover:text-background transition-colors font-bold uppercase"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase tracking-wider text-xs">Odômetro (KM)</Label>
              <Input 
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                type="number" 
                className="border-2 border-foreground rounded-none h-12 font-bold text-xl" 
              />
            </div>

          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-black uppercase tracking-widest border-b-4 border-foreground inline-block">Lista de Peças</h2>
            <Button onClick={addPart} variant="outline" size="sm" className="rounded-none border-2 border-foreground h-8 text-xs font-bold uppercase hover:bg-foreground hover:text-background">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {parts.map((part, index) => (
            <Card key={part.id} className="bg-card border-2 border-foreground rounded-none shadow-none relative">
              <CardContent className="p-3 space-y-3">
                <div className="flex justify-between items-center gap-2">
                   <Label className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Item #{index + 1}</Label>
                   <button onClick={() => removePart(part.id)} className="text-foreground border border-transparent p-1 hover:border-foreground">
                     <Trash2 className="h-4 w-4" />
                   </button>
                </div>
                
                <Input 
                  placeholder="Nome da peça" 
                  value={part.name}
                  onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                  className="border-b-2 border-l-0 border-r-0 border-t-0 border-foreground rounded-none h-10 font-bold px-0 focus-visible:ring-0" 
                />
                
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-0 top-3 font-bold text-muted-foreground text-sm">R$</span>
                    <Input 
                      placeholder="0,00" 
                      type="number"
                      value={part.cost || ''}
                      onChange={(e) => updatePart(part.id, 'cost', Number(e.target.value))}
                      className="border-2 border-foreground rounded-none h-10 font-black pl-6" 
                    />
                  </div>
                  <button
                    onClick={() => updatePart(part.id, 'isOriginal', !part.isOriginal)}
                    className={`h-10 px-3 text-xs font-black uppercase tracking-widest border-2 rounded-none transition-none flex-1 ${
                                part.isOriginal 
                                ? "bg-foreground text-background border-foreground" 
                                : "bg-transparent text-muted-foreground border-foreground border-dashed"
                              }`}
                  >
                    {part.isOriginal ? 'OEM' : 'After'}
                  </button>
                </div>

              </CardContent>
            </Card>
          ))}
          {parts.length === 0 && <p className="text-xs font-bold text-muted-foreground uppercase text-center mt-4">Nenhuma peça. Apenas mão de obra/serviço.</p>}

          {/* Total das peças */}
          {parts.length > 0 && (
            <div className="flex justify-between items-center p-3 border-2 border-foreground bg-muted mt-4">
              <span className="text-xs font-bold uppercase tracking-widest">Total em Peças:</span>
              <span className="font-black text-lg">{formatCurrency(totalCost)}</span>
            </div>
          )}
        </div>

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
