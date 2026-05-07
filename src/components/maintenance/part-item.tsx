"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { PartInput } from "@/types"
import { haptics } from "@/lib/haptics"

interface PartItemProps {
  index: number
  part: PartInput & { id: string }
  onUpdate: (id: string, field: string, value: any) => void
  onRemove: (id: string) => void
}

export function PartItem({ index, part, onUpdate, onRemove }: PartItemProps) {
  return (
    <Card className="bg-card border-2 border-foreground rounded-none shadow-none relative">
      <CardContent className="p-3 space-y-3">
        <div className="flex justify-between items-center gap-2">
           <Label className="font-black uppercase tracking-widest text-[9px] opacity-40">Item #{index + 1}</Label>
           <button 
             onClick={() => {
               haptics.light()
               onRemove(part.id)
             }} 
             className="text-foreground border border-transparent p-1 hover:border-foreground transition-none"
           >
             <Trash2 className="h-4 w-4" />
           </button>
        </div>
        
        <Input 
          placeholder="NOME DA PEÇA / COMPONENTE" 
          value={part.name}
          onChange={(e) => onUpdate(part.id, 'name', e.target.value)}
          className="border-b-2 border-l-0 border-r-0 border-t-0 border-foreground rounded-none h-10 font-black uppercase text-xs px-0 focus-visible:ring-0 placeholder:opacity-20" 
        />
        
        <div className="flex items-center gap-4 pt-1">
          <div className="flex-1 relative">
            <span className="absolute left-0 top-3 font-black text-foreground/40 text-xs">R$</span>
            <Input 
              placeholder="0,00" 
              type="number"
              value={part.cost || ''}
              onChange={(e) => onUpdate(part.id, 'cost', Number(e.target.value))}
              className="border-2 border-foreground rounded-none h-10 font-black pl-6 text-sm" 
            />
          </div>
          <button
            onClick={() => {
              haptics.light()
              onUpdate(part.id, 'isOriginal', !part.isOriginal)
            }}
            className={`h-10 px-3 text-[10px] font-black uppercase tracking-widest border-2 rounded-none transition-none flex-1 ${
                        part.isOriginal 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-transparent text-muted-foreground border-foreground border-dashed"
                      }`}
          >
            {part.isOriginal ? 'ORIGINAL OEM' : 'AFTERMARKET'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
