'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ShieldAlert, Settings2, Sparkles } from "lucide-react"
import { createMaintenanceRule, deleteMaintenanceRule, seedDefaultRules } from '@/app/actions/maintenance-rules'
import { toast } from "sonner"

interface Rule {
  id: string
  name: string
  intervalKm: number
  criticality: string
}

interface MaintenanceRulesManagerProps {
  vehicleId: string
  initialRules: Rule[]
}

export function MaintenanceRulesManager({ vehicleId, initialRules }: MaintenanceRulesManagerProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [newName, setNewName] = useState('')
  const [newInterval, setNewInterval] = useState('5000')
  const [newCriticality, setNewCriticality] = useState('medium')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const rule = await createMaintenanceRule({
        vehicleId,
        name: newName,
        intervalKm: parseInt(newInterval),
        criticality: newCriticality,
        category: 'general'
      })
      setRules([...rules, rule as Rule])
      setNewName('')
      setIsAdding(false)
      toast.success("Regra de manutenção adicionada!")
    } catch (error) {
      toast.error("Erro ao adicionar regra")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMaintenanceRule(id)
      setRules(rules.filter(r => r.id !== id))
      toast.success("Regra removida")
    } catch (error) {
      toast.error("Erro ao remover regra")
    }
  }

  const handleSeed = async () => {
    setIsLoading(true)
    try {
      await seedDefaultRules(vehicleId)
      window.location.reload()
    } catch (error) {
      toast.error("Erro ao gerar regras padrão")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b-4 border-foreground pb-2">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          <h2 className="text-lg font-black uppercase italic">REGRAS PREDITIVAS (IA)</h2>
        </div>
        {rules.length === 0 && (
          <Button 
            onClick={handleSeed}
            disabled={isLoading}
            variant="outline" 
            className="h-8 text-[10px] font-black uppercase border-2 border-foreground"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            GERAR PADRÃO
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {rules.length === 0 ? (
          <p className="text-[10px] font-black uppercase opacity-40 text-center py-8">
            Nenhuma regra configurada. O sistema está usando padrões globais.
          </p>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id} className="kindle-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black uppercase text-sm italic">{rule.name}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 border-2 border-foreground ${
                      rule.criticality === 'high' || rule.criticality === 'critical' 
                        ? 'bg-foreground text-background' 
                        : 'bg-background text-foreground'
                    }`}>
                      {rule.criticality.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] font-black opacity-60">INTERVALO: {rule.intervalKm.toLocaleString()} KM</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(rule.id)}
                  className="h-10 w-10 border-2 border-foreground/10 hover:border-foreground hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        {isAdding ? (
          <form onSubmit={handleAdd} className="kindle-card bg-zinc-50 space-y-4 p-6 border-dashed">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] font-black uppercase">Nome do Componente</Label>
                <Input 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ex: Óleo, Pastilhas..."
                  className="kindle-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Intervalo (KM)</Label>
                <Input 
                  type="number"
                  value={newInterval}
                  onChange={e => setNewInterval(e.target.value)}
                  className="kindle-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Criticidade</Label>
                <select 
                  value={newCriticality}
                  onChange={e => setNewCriticality(e.target.value)}
                  className="flex h-12 w-full border-4 border-foreground bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-black uppercase"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="kindle-button flex-1 h-12">SALVAR REGRA</Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="kindle-button flex-1 h-12">CANCELAR</Button>
            </div>
          </form>
        ) : (
          <Button 
            onClick={() => setIsAdding(true)}
            variant="outline" 
            className="kindle-button border-dashed opacity-60 hover:opacity-100 h-16"
          >
            <Plus className="h-5 w-5 mr-2" />
            ADICIONAR REGRA CUSTOMIZADA
          </Button>
        )}
      </div>

      <div className="p-4 bg-muted/10 border-2 border-foreground/10 flex gap-4">
         <ShieldAlert className="h-6 w-6 shrink-0 opacity-40" />
         <p className="text-[9px] font-black uppercase opacity-40 leading-relaxed">
           AS REGRAS PREDITIVAS SÃO PROCESSADAS PELO AGENTE DE IA PARA GERAR ALERTAS NO PAINEL E NO PASSAPORTE TÉCNICO.
         </p>
      </div>
    </div>
  )
}
