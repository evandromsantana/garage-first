"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Package, Award, Wrench } from "lucide-react"
import { haptics } from "@/lib/haptics"

export function QuickActions() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
         <Wrench className="h-4 w-4" />
         <h3 className="text-xs font-black uppercase tracking-widest">Painel de Operações</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/maintenance/new" className="group">
          <Button 
            variant="outline" 
            className="w-full h-28 flex-col gap-2 border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground hover:text-background transition-all active:translate-y-1 active:shadow-none"
            onClick={() => haptics.light()}
          >
            <Plus className="h-6 w-6" />
            <span className="font-black uppercase tracking-tighter text-[10px]">Novo Serviço</span>
          </Button>
        </Link>

        <Link href="/technical" className="group">
          <Button 
            variant="outline" 
            className="w-full h-28 flex-col gap-2 border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground hover:text-background transition-all active:translate-y-1 active:shadow-none"
            onClick={() => haptics.light()}
          >
            <BookOpen className="h-6 w-6" />
            <span className="font-black uppercase tracking-tighter text-[10px]">Manuais Técnicos</span>
          </Button>
        </Link>

        <Link href="/inventory" className="group">
          <Button 
            variant="outline" 
            className="w-full h-28 flex-col gap-2 border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground hover:text-background transition-all active:translate-y-1 active:shadow-none"
            onClick={() => haptics.light()}
          >
            <Package className="h-6 w-6" />
            <span className="font-black uppercase tracking-tighter text-[10px]">Almoxarifado</span>
          </Button>
        </Link>

        <Link href="/passport" className="group">
          <Button 
            variant="outline" 
            className="w-full h-28 flex-col gap-2 border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] hover:bg-foreground hover:text-background transition-all active:translate-y-1 active:shadow-none"
            onClick={() => haptics.light()}
          >
            <Award className="h-6 w-6" />
            <span className="font-black uppercase tracking-tighter text-[10px]">Passaporte</span>
          </Button>
        </Link>
      </div>
    </section>
  )
}
