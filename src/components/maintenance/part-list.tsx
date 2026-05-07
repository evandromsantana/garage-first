"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PartItem } from "./part-item"
import { ScannerOCR } from "@/components/scanner-ocr"
import { TorqueGuide } from "@/components/torque-guide"
import { formatCurrency } from "@/lib"
import { haptics } from "@/lib/haptics"
import { PartInput, InventoryItem } from "@/types"

interface Part extends PartInput {
  id: string
}

interface PartListProps {
  parts: Part[]
  setParts: (parts: Part[]) => void
  inventory?: InventoryItem[]
}

export function PartList({ parts, setParts, inventory = [] }: PartListProps) {
  const totalCost = parts.reduce((sum, part) => sum + (part.cost || 0), 0)

  const availableInventory = inventory.filter(item => 
    item.quantity > 0 && 
    !parts.some(p => p.name.toLowerCase() === item.name.toLowerCase())
  )

  const addInventoryPart = (item: InventoryItem) => {
    haptics.success()
    setParts([...parts, { 
      id: crypto.randomUUID(), 
      name: item.name, 
      cost: Number(item.price) || 0, 
      isOriginal: true,
      inventoryItemId: item.id
    }])
  }

  const addPart = () => {
    haptics.light()
    setParts([...parts, { id: crypto.randomUUID(), name: "", cost: 0, isOriginal: false }])
  }

  const updatePart = (id: string, field: string, value: any) => {
    setParts(parts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const removePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <h2 className="font-black uppercase tracking-widest border-b-4 border-foreground inline-block self-start">Lista de Peças</h2>
        <div className="flex gap-2">
          <TorqueGuide />
          <Button 
            onClick={addPart} 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-none border-4 border-foreground h-12 text-[10px] font-black uppercase hover:bg-foreground hover:text-background transition-none shadow-[4px_4px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Manual
          </Button>
        </div>
      </div>

      <ScannerOCR 
        onScanResult={(text) => {
          haptics.success()
          setParts([...parts, { id: crypto.randomUUID(), name: text, cost: 0, isOriginal: true }])
        }} 
      />

      {/* Sugestões do Almoxarifado */}
      {availableInventory.length > 0 && (
        <div className="space-y-2">
           <p className="text-[9px] font-black uppercase opacity-40 tracking-widest px-1">Disponível no Almoxarifado:</p>
           <div className="flex flex-wrap gap-2">
              {availableInventory.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  onClick={() => addInventoryPart(item)}
                  className="bg-zinc-100 border-2 border-foreground/10 px-3 py-2 text-[10px] font-black uppercase tracking-tighter hover:bg-foreground hover:text-background transition-none flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" />
                  {item.name} ({item.quantity})
                </button>
              ))}
           </div>
        </div>
      )}

      <div className="space-y-3">
        {parts.map((part, index) => (
          <PartItem 
            key={part.id} 
            index={index} 
            part={part} 
            onUpdate={updatePart} 
            onRemove={removePart} 
          />
        ))}
      </div>

      {parts.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-foreground/20 bg-muted/30">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Nenhuma peça registrada.<br/>Apenas mão de obra/serviço.
          </p>
        </div>
      ) : (
        <div className="flex justify-between items-center p-4 border-4 border-foreground bg-muted mt-6 shadow-[4px_4px_0_0_var(--foreground)]">
          <span className="text-[10px] font-black uppercase tracking-widest">Investimento em Peças:</span>
          <span className="font-black text-xl">{formatCurrency(totalCost)}</span>
        </div>
      )}
    </div>
  )
}
