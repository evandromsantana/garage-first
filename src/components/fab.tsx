"use client"

import { Wrench } from "lucide-react"

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Ativar Modo Oficina"
      className="fixed bottom-6 right-6 z-50 h-20 w-20 bg-foreground text-background border-4 border-background shadow-[0_0_0_4px_var(--foreground)] rounded-none flex flex-col items-center justify-center hover:scale-95 active:scale-90 transition-all group"
    >
      <Wrench className="h-8 w-8 group-hover:rotate-12 transition-transform" aria-hidden="true" />
      <span className="text-[8px] font-black uppercase mt-1">OFICINA</span>
    </button>
  )
}
