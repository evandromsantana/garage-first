"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FAB() {
  return (
    <Link href="/maintenance/new">
      <Button
        size="lg"
        className="fixed bottom-20 right-6 h-16 w-16 rounded-none shadow-[2px_2px_0_0_var(--foreground)] transition-transform hover:scale-95 hover:-translate-y-1 z-50 bg-background hover:bg-foreground hover:text-background border-4 border-foreground text-foreground"
      >
        <Plus className="h-8 w-8 font-black" />
        <span className="sr-only">Nova manutenção detalhada</span>
      </Button>
    </Link>
  )
}
