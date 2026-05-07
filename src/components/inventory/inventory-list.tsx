"use client"

import { useTransition } from "react"
import { updateInventoryItemQuantity, deleteInventoryItem } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Trash2, Box, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { InventoryItem } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InventoryListProps {
  items: InventoryItem[]
}

export function InventoryList({ items }: InventoryListProps) {
  const [isPending, startTransition] = useTransition()

  const handleUpdateQuantity = (id: string, delta: number) => {
    startTransition(async () => {
      try {
        await updateInventoryItemQuantity(id, delta)
        toast.success("Estoque atualizado")
      } catch {
        toast.error("Erro ao atualizar")
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteInventoryItem(id)
        toast.success("Item removido")
      } catch {
        toast.error("Erro ao remover")
      }
    })
  }

  if (items.length === 0) {
    return (
      <div className="p-12 border-4 border-dashed border-foreground/20 text-center space-y-4">
        <Box className="h-12 w-12 mx-auto opacity-20" />
        <p className="font-black uppercase text-sm">Almoxarifado Vazio</p>
        <p className="text-xs font-bold text-muted-foreground uppercase">
          Adicione as peças que você tem em estoque para facilitar o registro de manutenção.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isLowStock = item.quantity <= item.minQuantity
        
        return (
          <Card key={item.id} className={`kindle-card ${isLowStock ? 'bg-muted/5' : ''}`}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">
                      {item.name}
                    </h3>
                    {isLowStock && (
                      <span className="bg-foreground text-background text-[10px] font-black px-2 py-1 uppercase flex items-center gap-1 border-2 border-foreground">
                        <AlertTriangle className="h-3 w-3" />
                        Crítico
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                    {item.category} • {item.location || "NÃO LOCALIZADO"}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t-2 sm:border-t-0 border-foreground/10 pt-4 sm:pt-0">
                  <div className="flex items-center border-4 border-foreground bg-background shadow-[4px_4px_0_0_var(--foreground)]">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending || item.quantity <= 0}
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="rounded-none border-r-4 border-foreground hover:bg-foreground hover:text-background h-14 w-14 p-0 transition-none"
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="w-16 text-center font-black text-2xl font-mono">
                      {item.quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="rounded-none border-l-4 border-foreground hover:bg-foreground hover:text-background h-14 w-14 p-0 transition-none"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isPending}
                          className="h-14 w-14 border-4 border-foreground rounded-none hover:bg-destructive hover:text-destructive-foreground transition-none shrink-0"
                        />
                      }
                    >
                      <Trash2 className="h-6 w-6" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-4 border-foreground rounded-none bg-background">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase italic">Remover Item?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-bold uppercase opacity-60">
                          Esta ação não pode ser desfeita. O item será permanentemente removido do almoxarifado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="bg-muted/10 border-t-4 border-foreground p-4">
                        <AlertDialogCancel className="h-12 border-4 border-foreground rounded-none font-black uppercase">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(item.id)}
                          className="h-12 border-4 border-foreground bg-foreground text-background rounded-none font-black uppercase hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
