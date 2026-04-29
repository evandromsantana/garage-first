"use client"

import { Plus } from "lucide-react"
import Link from "next/link"

export function FAB() {
  return (
    <Link
      href="/maintenance/new"
      aria-label="Adicionar nova manutenção"
      className="fixed bottom-20 right-4 z-50 h-16 w-16 bg-foreground text-background border-4 border-background shadow-[0_0_0_4px_var(--foreground)] rounded-none flex items-center justify-center hover:scale-95 transition-transform"
    >
      <Plus className="h-8 w-8" aria-hidden="true" />
    </Link>
  )
}
