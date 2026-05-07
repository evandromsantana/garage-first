"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface ChecklistViewProps {
  title: string
  items: string[]
  checkedItems: Record<string, boolean>
  onToggleCheck: (item: string) => void
  onComplete: () => void
  onCancel: () => void
}

export function ChecklistView({ 
  title, 
  items, 
  checkedItems, 
  onToggleCheck, 
  onComplete, 
  onCancel 
}: ChecklistViewProps) {
  const allChecked = items.every(item => checkedItems[item])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
      <div className="p-4 border-b-4 border-foreground flex items-center justify-between">
        <h2 className="text-xl font-black uppercase">{title}</h2>
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={onCancel} 
          className="h-14 text-foreground border-2 border-foreground rounded-none"
        >
          CANCELAR
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {items.map((item, idx) => (
          <Button 
            key={idx} 
            variant={checkedItems[item] ? "default" : "outline"} 
            className={`w-full h-20 justify-start px-4 rounded-none border-4 ${checkedItems[item] ? 'bg-foreground text-background border-foreground' : 'border-foreground shadow-[4px_4px_0_0_var(--foreground)]'}`} 
            onClick={() => onToggleCheck(item)}
          >
            <div className={`h-6 w-6 border-2 border-current mr-4 flex items-center justify-center ${checkedItems[item] ? 'bg-background text-foreground' : ''}`}>
              {checkedItems[item] && <Check className="h-4 w-4" />}
            </div>
            <span className="font-black uppercase">{item}</span>
          </Button>
        ))}
      </div>
      <div className="p-4 border-t-4 border-foreground bg-muted fixed bottom-0 left-0 right-0 z-10 w-full">
        <Button 
          size="lg" 
          disabled={!allChecked} 
          className={`w-full h-16 text-xl font-black uppercase rounded-none border-4 border-foreground ${allChecked ? 'bg-foreground text-background shadow-[4px_4px_0_0_var(--foreground)]' : 'opacity-50 hidden'}`} 
          onClick={onComplete}
        >
          FINALIZAR REGISTRO
        </Button>
      </div>
    </div>
  )
}
