"use client"

import { useState, useTransition } from "react"
import { createInventoryItem } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package } from "lucide-react"
import { toast } from "sonner"
import { InventoryCategory } from "@/types"

export function AddInventoryItemForm() {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const data = {
        name: formData.get("name") as string,
        quantity: parseInt(formData.get("quantity") as string),
        minQuantity: parseInt(formData.get("minQuantity") as string),
        category: formData.get("category") as InventoryCategory,
        location: formData.get("location") as string,
        notes: formData.get("notes") as string,
      }

      try {
        const result = await createInventoryItem(data)
        if (result.success) {
          toast.success("Item adicionado ao almoxarifado")
          setIsOpen(false)
        } else {
          toast.error(`Erro: ${result.error}`)
        }
      } catch (err) {
        toast.error("Erro de conexão ao tentar salvar")
      }
    })
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full h-20 text-lg font-black uppercase rounded-none border-4 border-foreground shadow-[6px_6px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none transition-none"
      >
        <Plus className="mr-2 h-8 w-8" />
        INSERIR NO ALMOXARIFADO
      </Button>
    )
  }

  return (
    <Card className="kindle-card">
      <CardHeader className="border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter">
          <Package className="h-6 w-6" />
          REGISTRO DE NOVO ITEM
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest opacity-40">DESCRIÇÃO TÉCNICA / NOME</Label>
            <Input 
              name="name" 
              required 
              placeholder="EX: FILTRO DE ÓLEO KN-303"
              className="h-14 border-4 border-foreground rounded-none font-black uppercase text-sm focus:ring-0 placeholder:opacity-20" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest opacity-40">ESTOQUE DISPONÍVEL</Label>
              <Input 
                name="quantity" 
                type="number" 
                required 
                defaultValue="1"
                className="h-14 border-4 border-foreground rounded-none font-black text-2xl focus:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest opacity-40">MÍNIMO CRÍTICO</Label>
              <Input 
                name="minQuantity" 
                type="number" 
                required 
                defaultValue="1"
                className="h-14 border-4 border-foreground rounded-none font-black text-2xl focus:ring-0" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest opacity-40">CATEGORIA TÉCNICA</Label>
            <Select name="category" defaultValue="PART">
              <SelectTrigger className="h-14 border-4 border-foreground rounded-none font-black uppercase focus:ring-0">
                <SelectValue placeholder="SELECIONE CATEGORIA" />
              </SelectTrigger>
              <SelectContent className="border-4 border-foreground rounded-none">
                <SelectItem value="CONSUMABLE" className="font-black uppercase text-xs">CONSUMÍVEL</SelectItem>
                <SelectItem value="PART" className="font-black uppercase text-xs">PEÇA REPOSIÇÃO</SelectItem>
                <SelectItem value="TOOL" className="font-black uppercase text-xs">FERRAMENTAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest opacity-40">ENDEREÇAMENTO FÍSICO</Label>
            <Input 
              name="location" 
              placeholder="EX: PRATELEIRA A, GAVETA 2"
              className="h-14 border-4 border-foreground rounded-none font-black uppercase text-sm focus:ring-0 placeholder:opacity-20" 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 h-16 text-sm font-black uppercase rounded-none border-4 border-foreground transition-none"
            >
              ABORTAR
            </Button>
            <Button 
              disabled={isPending}
              className="flex-1 h-16 text-sm font-black uppercase rounded-none border-4 border-foreground bg-foreground text-background transition-none shadow-[6px_6px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
            >
              EFETIVAR REGISTRO
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
