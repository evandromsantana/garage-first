"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wrench, Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"

const TORQUE_SPECS = [
  { part: "Bujão de Dreno (Óleo)", value: "30 N·m", notes: "Trocar arruela de esmagamento" },
  { part: "Filtro de Óleo", value: "17 N·m", notes: "Ou 3/4 de volta após encostar" },
  { part: "Eixo Dianteiro", value: "108 N·m", notes: "Sem travar rosca" },
  { part: "Eixo Traseiro", value: "98 N·m", notes: "Crucial para segurança" },
  { part: "Pinças de Freio (Frontal)", value: "25 N·m", notes: "Pinos de fixação" },
  { part: "Velas de Ignição", value: "13 N·m", notes: "Instalar com motor frio" },
  { part: "Parafusos da Coroa", value: "59 N·m", notes: "Usar trava química azul" },
  { part: "Tampa de Embreagem", value: "9.8 N·m", notes: "Padrão estrela" },
]

export function TorqueGuide() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSpecs = TORQUE_SPECS.filter(spec => 
    spec.part.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="h-8 border-2 border-foreground bg-yellow-400 text-foreground font-black uppercase text-[10px] rounded-none hover:bg-yellow-500">
            <Wrench className="h-3 w-3 mr-1" /> Guia de Torque
          </Button>
        } 
      />
      <DialogContent className="max-w-md border-4 border-foreground rounded-none font-mono">
        <DialogHeader className="border-b-4 border-foreground pb-4">
          <DialogTitle className="text-xl font-black uppercase flex items-center gap-2">
            <Wrench className="h-6 w-6" /> Especificações de Torque
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar peça... (Ex: Eixo, Óleo)"
              className="pl-10 border-2 border-foreground rounded-none font-bold uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {filteredSpecs.map((spec, i) => (
              <div key={i} className="p-3 border-2 border-foreground bg-muted/30 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="font-black uppercase text-sm">{spec.part}</span>
                  <span className="bg-foreground text-background px-2 py-1 text-xs font-black">{spec.value}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground italic uppercase">
                  <Info className="h-3 w-3" />
                  {spec.notes}
                </div>
              </div>
            ))}
            {filteredSpecs.length === 0 && (
              <p className="text-center py-10 font-bold uppercase text-muted-foreground">Nenhuma especificação encontrada.</p>
            )}
          </div>
        </div>

        <div className="bg-foreground text-background p-3 text-[10px] font-bold uppercase text-center border-t-2 border-foreground">
          ⚠️ Valores baseados no manual de serviço Ninja 400.
        </div>
      </DialogContent>
    </Dialog>
  )
}
