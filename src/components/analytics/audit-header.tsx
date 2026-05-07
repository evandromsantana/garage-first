"use client"

import { useEffect, useState } from 'react'

export function AuditHeader() {
  const [hash, setHash] = useState('B3X9Z1')

  useEffect(() => {
    setHash(Math.random().toString(36).substring(7).toUpperCase())
  }, [])

  return (
    <div className="kindle-card bg-foreground text-background text-center py-12 space-y-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-background opacity-20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-background opacity-20" />
      
      <div className="space-y-2 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">Relatório de Procedência Extrema</p>
        <h2 className="text-5xl font-black italic uppercase leading-none tracking-tighter">Status de Conservação</h2>
        <p className="text-[9px] font-mono uppercase opacity-60">Hash de Integridade: {hash}</p>
      </div>
      
      <div className="inline-flex items-center gap-4 border-2 border-background px-6 py-2 mt-6 relative z-10">
        <div className="w-3 h-3 bg-background animate-pulse" />
        <span className="text-sm font-black uppercase tracking-widest italic">Procedência Nível A+ Verificada</span>
      </div>
    </div>
  )
}
