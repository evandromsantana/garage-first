"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Plus, Trash2, Gauge, Droplets, Info } from "lucide-react"
import { createTechnicalSpec, deleteTechnicalSpec } from "@/app/actions"
import { toast } from "sonner"
import { haptics } from "@/lib/haptics"

import { TechnicalSpec } from "@/types"

interface TechnicalSpecsManagerProps {
  vehicleId: string
  initialSpecs: TechnicalSpec[]
}

export function TechnicalSpecsManager({ vehicleId, initialSpecs }: TechnicalSpecsManagerProps) {
  const [specs, setSpecs] = useState<TechnicalSpec[]>(initialSpecs)
  const [category, setCategory] = useState("TORQUE")
  const [component, setComponent] = useState("")
  const [value, setValue] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!component || !value) return
    
    setLoading(true)
    haptics.light()
    
    try {
      const newSpec = await createTechnicalSpec({
        vehicleId,
        category,
        component,
        value,
        notes
      })
      setSpecs([newSpec as TechnicalSpec, ...specs])
      setComponent("")
      setValue("")
      setNotes("")
      toast.success("Especificação adicionada")
      haptics.success()
    } catch (error) {
      toast.error("Erro ao adicionar")
      haptics.error()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    haptics.light()
    try {
      await deleteTechnicalSpec(id)
      setSpecs(specs.filter(s => s.id !== id))
      toast.success("Removido")
    } catch {
      toast.error("Erro ao remover")
    }
  }

  const getIcon = (cat: string) => {
    switch (cat) {
      case "TORQUE": return <Wrench className="h-4 w-4" />
      case "PRESSURE": return <Gauge className="h-4 w-4" />
      case "FLUID": return <Droplets className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="kindle-card">
        <CardHeader className="pb-6 border-b-4 border-foreground">
          <CardTitle className="text-xl font-black uppercase italic">MANUAL DE ESPECIFICAÇÕES</CardTitle>
          <CardDescription className="font-black uppercase text-[10px] tracking-[0.2em] opacity-60">
            REGISTRE TORQUES, PRESSÕES E CAPACIDADES DO SEU MODELO
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleAdd} className="space-y-4 mb-8 p-4 bg-zinc-100 border-2 border-dashed border-foreground/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">CATEGORIA</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-2 border-foreground rounded-none h-10 font-black uppercase text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-foreground rounded-none font-black uppercase text-xs">
                    <SelectItem value="TORQUE">🔧 TORQUE DE APERTO</SelectItem>
                    <SelectItem value="PRESSURE">⚖️ PRESSÃO / CALIBRAGEM</SelectItem>
                    <SelectItem value="FLUID">💧 FLUÍDO / ÓLEO</SelectItem>
                    <SelectItem value="CAPACITY">📏 CAPACIDADE / VOLUME</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">COMPONENTE (EX: EIXO TRASEIRO)</Label>
                <Input 
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="border-2 border-foreground rounded-none h-10 font-black text-xs uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">VALOR (EX: 98 NM / 32 PSI)</Label>
                <Input 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="border-2 border-foreground rounded-none h-10 font-black text-xs uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">NOTAS / OBSERVAÇÕES</Label>
                <Input 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-2 border-foreground rounded-none h-10 font-black text-xs uppercase"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="kindle-button w-full h-12">
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR ESPECIFICAÇÃO
            </Button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {specs.length === 0 ? (
              <p className="text-center py-10 opacity-30 italic uppercase font-black text-xs">Nenhuma especificação cadastrada.</p>
            ) : (
              specs.map((spec) => (
                <div key={spec.id} className="p-3 border-2 border-foreground flex items-center justify-between group bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground text-background">
                      {getIcon(spec.category)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-tighter">{spec.category}</p>
                      <p className="font-black text-sm uppercase">{spec.component}</p>
                      {spec.notes && <p className="text-[9px] font-bold italic opacity-60 uppercase">{spec.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-lg italic tracking-tighter">{spec.value}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(spec.id)}
                      className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
