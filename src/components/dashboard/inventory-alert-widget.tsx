"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { InventoryItem } from "@/types"

export function InventoryAlertWidget({ items }: { items: InventoryItem[] }) {
  const lowStockItems = items.filter(item => item.quantity <= (item.minQuantity || 1))

  if (lowStockItems.length === 0) return null

  return (
    <Card className="kindle-card border-dashed bg-muted/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Alerta de Almoxarifado</h3>
          </div>
          <span className="text-[10px] font-black bg-destructive text-destructive-foreground px-1.5">
            {lowStockItems.length} CRÍTICO
          </span>
        </div>

        <div className="space-y-2">
          {lowStockItems.slice(0, 3).map(item => (
            <div key={item.id} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 opacity-40" />
                <span className="font-black uppercase truncate max-w-[120px]">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-40">QTD:</span>
                <span className="font-black text-destructive">{item.quantity}</span>
                <span className="opacity-20">/</span>
                <span className="opacity-40">{item.minQuantity}</span>
              </div>
            </div>
          ))}
        </div>

        <Link href="/inventory" className="flex items-center justify-center gap-2 pt-2 border-t border-foreground/10 text-[9px] font-black uppercase hover:opacity-60 transition-opacity">
          GERENCIAR ESTOQUE <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  )
}
