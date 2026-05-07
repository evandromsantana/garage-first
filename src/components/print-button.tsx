"use client"

import { FileText } from "lucide-react"

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="w-full h-14 bg-foreground text-background font-black uppercase tracking-widest border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
    >
      <FileText className="h-5 w-5" />
      Imprimir Passaporte
    </button>
  )
}
