"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { List, Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface MaintenanceLog {
  type: string
}

interface PartExpense {
  id: string
  itemName: string
  itemCost: number
  isOriginalPart: boolean
  createdAt: Date
  maintenanceLog: MaintenanceLog
}

interface PartsListProps {
  expenses: PartExpense[]
}

export function PartsList({ expenses }: PartsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<'date' | 'price'>('date')

  const filtered = expenses.filter(part => 
    part.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOrder === 'price') return b.itemCost - a.itemCost
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      <div className="mt-8 mb-4 border-b-4 border-foreground pb-4">
        <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-4">
          <List className="h-6 w-6" />
          Registro de Peças
        </h2>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="PESQUISAR PEÇA..." 
              className="w-full pl-10 border-4 border-foreground rounded-none h-12 font-bold uppercase focus-visible:ring-0 shadow-[2px_2px_0_0_colord(var(--foreground))]"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSortOrder(sortOrder === 'date' ? 'price' : 'date')}
            className="h-12 border-4 border-foreground rounded-none shadow-[2px_2px_0_0_colord(var(--foreground))]"
            title={`Ordenar por ${sortOrder === 'date' ? 'Preço' : 'Data'}`}
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {filtered.map(part => (
        <Card key={part.id} className="bg-background border-4 border-foreground rounded-none shadow-[2px_2px_0_0_colord(var(--foreground))] hover:bg-foreground/5 hover:translate-x-1 transition-transform cursor-pointer group">
          <CardContent className="p-0 flex justify-between items-stretch">
            <div className="p-4 flex-1">
              <p className="font-black text-lg uppercase leading-none">{part.itemName}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2 tracking-widest group-hover:text-foreground">
                [{part.maintenanceLog.type}] • {new Date(part.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="p-4 border-l-4 border-foreground flex flex-col justify-center items-end bg-muted">
              <p className="font-black text-xl whitespace-nowrap">{formatCurrency(part.itemCost)}</p>
              {part.isOriginalPart ? (
                  <Badge variant="outline" className="rounded-none border-2 border-foreground bg-foreground text-background font-black uppercase tracking-widest text-[10px] mt-1 shadow-none">OEM</Badge>
              ) : (
                  <Badge variant="outline" className="rounded-none border-2 border-dashed border-foreground/50 text-foreground font-black uppercase tracking-widest text-[10px] mt-1 shadow-none bg-background">AFTER</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {filtered.length === 0 && (
        <p className="text-center font-bold text-muted-foreground uppercase pt-8">
          Nenhuma peça encontrada.
        </p>
      )}
    </div>
  )
}
