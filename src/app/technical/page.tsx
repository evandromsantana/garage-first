"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { AlertCircle, Wrench, Settings2, Droplets, Book, Search } from "lucide-react"
import { OEM_PARTS, FLUID_CAPACITIES, DIAGNOSTIC_CODES } from "@/lib/technical-data"

export default function TechnicalCenterPage() {
  const [search, setSearch] = useState("")

  const filteredParts = OEM_PARTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  )

  const filteredFluids = FLUID_CAPACITIES.filter(f => 
    f.sys.toLowerCase().includes(search.toLowerCase()) || 
    f.note.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCodes = DIAGNOSTIC_CODES.filter(c => 
    c.error.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  const hasResults = filteredParts.length > 0 || filteredFluids.length > 0 || filteredCodes.length > 0

  return (
    <div className="kindle-page">
      <PageHeader
        title="CENTRO DE INFORMAÇÃO TÉCNICA"
        icon={<Book className="h-6 w-6" />}
        backHref="/dashboard"
      />

      <main className="space-y-6 pt-6">
        {/* Header Bulletin */}
        <div className="border-y-4 border-foreground py-4 text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Boletim de Serviço № 001/2026</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">MANUAL DE CONSULTA RÁPIDA</h1>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">PADRÃO DE FÁBRICA • DADOS CERTIFICADOS</p>
        </div>

        {/* Search Bar */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 border-b-2 border-foreground/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="BUSCAR PEÇA, TORQUE OU CÓDIGO DE ERRO..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-4 border-foreground rounded-none h-14 font-black uppercase text-sm tracking-tight focus-visible:ring-0"
            />
          </div>
        </div>

        {!hasResults ? (
          <div className="text-center py-20 border-4 border-dashed border-foreground/20">
             <p className="text-sm font-black uppercase opacity-40 tracking-widest">Nenhum registro encontrado para "{search}"</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* OEM Part Numbers */}
            {filteredParts.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
                  <Settings2 className="h-4 w-4" />
                  <h2 className="text-sm font-black uppercase tracking-widest">SEÇÃO 01: COMPONENTES OEM (PEÇAS)</h2>
                </div>
                
                <div className="space-y-4">
                  {filteredParts.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-black uppercase text-lg shrink-0">{item.name}</span>
                        <div className="border-b-2 border-dotted border-foreground flex-grow mb-1.5" />
                        <span className="font-mono text-sm font-bold bg-foreground text-background px-2">{item.code}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1 italic">
                        Especificação: {item.spec}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Fluid Capacities */}
            {filteredFluids.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
                  <Droplets className="h-4 w-4" />
                  <h2 className="text-sm font-black uppercase tracking-widest">SEÇÃO 02: FLUIDOS E LUBRIFICAÇÃO</h2>
                </div>
                
                <div className="grid gap-4">
                  {filteredFluids.map((fluid, i) => (
                    <div key={i} className="kindle-card bg-muted/20 flex justify-between items-center p-5">
                      <div className="space-y-1">
                        <p className="text-xl font-black uppercase italic leading-none">{fluid.sys}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-none">{fluid.note}</p>
                      </div>
                      <div className="text-right border-l-2 border-foreground pl-4">
                        <span className="text-2xl font-black">{fluid.cap}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Diagnostic Codes */}
            {filteredCodes.length > 0 && (
              <section className="space-y-4 pb-12">
                <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
                  <AlertCircle className="h-4 w-4" />
                  <h2 className="text-sm font-black uppercase tracking-widest">SEÇÃO 03: TABELA DE CÓDIGOS DE ERRO (FI)</h2>
                </div>
                
                <div className="kindle-card border-dashed">
                  <div className="divide-y-2 divide-foreground/20">
                    {filteredCodes.map((diag, i) => (
                      <div key={i} className="py-4 px-2 flex gap-4 items-start">
                        <div className="font-black bg-foreground text-background px-2 py-1 text-xs shrink-0 mt-0.5">
                          {diag.error}
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif leading-tight text-base italic font-bold">
                            {diag.desc}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                            Causa Provável: Verificação de Hardware Necessária
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Marginalia Footer */}
        <footer className="border-t-4 border-foreground pt-6 pb-20 text-center">
          <div className="inline-block border-2 border-foreground px-4 py-2 rotate-1">
            <p className="text-[10px] font-black uppercase tracking-widest">
              CONTROLE DE QUALIDADE TÉCNICA № 2026-X
            </p>
          </div>
          <p className="mt-6 text-[9px] font-black uppercase opacity-30 max-w-[200px] mx-auto leading-relaxed">
            AVISO: ESTES DADOS SÃO EXCLUSIVOS PARA REFERÊNCIA TÉCNICA. CONSULTE SEMPRE O MANUAL DE SERVIÇO OFICIAL.
          </p>
        </footer>
      </main>
    </div>
  )
}
