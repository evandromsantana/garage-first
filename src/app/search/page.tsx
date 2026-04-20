"use client"

import { useState } from "react"
import { searchTechnicalSpecs } from "@/app/actions"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wrench, FileImage, Zap, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TechnicalSpec } from "@/types"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<TechnicalSpec[]>([])
  const [selected, setSelected] = useState<TechnicalSpec | null>(null)

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.length >= 2) {
      const specs = await searchTechnicalSpecs(value)
      setResults(specs)
    } else {
      setResults([])
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4 shadow-[0_4px_0_0_colord(var(--foreground))]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-4 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] active:translate-y-1 active:shadow-none">
            <ArrowLeft className="h-6 w-6 font-black" />
          </Link>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Busca Rápida</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        <Command className="rounded-none border-4 border-foreground bg-card">
          <CommandInput
            placeholder="[ BUSCAR TORQUE, COMPONENTE... ]"
            value={query}
            onValueChange={handleSearch}
            className="h-14 font-bold border-b-4 border-foreground rounded-none uppercase"
          />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Especificações Técnicas">
              {results.map((spec) => (
                <CommandItem
                  key={spec.id}
                  onSelect={() => setSelected(spec)}
                  className="cursor-pointer py-4 border-b-2 border-dashed border-foreground/30 rounded-none aria-selected:bg-foreground aria-selected:text-background transition-none"
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="mt-1">
                      {spec.category === "Torque" && <Zap className="h-5 w-5" />}
                      {spec.category === "Diagram" && <FileImage className="h-5 w-5" />}
                      {spec.category === "Procedure" && <Wrench className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg uppercase">{spec.component}</p>
                      <p className="text-xs font-bold tracking-widest uppercase opacity-70">[{spec.category}]</p>
                    </div>
                    {spec.torqueNm && (
                      <Badge variant="outline" className="border-2 border-current rounded-none font-bold text-base h-8">{spec.torqueNm} Nm</Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        {selected && (
          <Card className="rounded-none border-4 border-foreground shadow-[4px_4px_0_0_var(--foreground)]">
            <CardHeader className="border-b-4 border-foreground pb-4 flex flex-row items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-2 rounded-none border-foreground font-black uppercase tracking-widest text-[10px]">
                  {selected.category}
                </Badge>
                <CardTitle className="font-black text-2xl uppercase leading-none">{selected.component}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelected(null)} className="h-10 w-10 border-2 border-foreground hover:bg-foreground hover:text-background rounded-none">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {selected.torqueNm && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b-2 border-dashed border-foreground/30 pb-1 inline-block">[ TORQUE APERTO ]</p>
                  <div className="flex items-end gap-2">
                    <p className="text-5xl font-black">{selected.torqueNm}</p>
                    <p className="text-xl font-black mb-1">Nm</p>
                  </div>
                </div>
              )}

              {selected.notes && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b-2 border-dashed border-foreground/30 pb-1 inline-block">[ OBSERVAÇÕES ]</p>
                  <p className="text-lg font-bold leading-tight uppercase border-l-4 border-foreground pl-4 py-1">{selected.notes}</p>
                </div>
              )}

              {selected.diagramCode && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b-2 border-dashed border-foreground/30 pb-1 inline-block">[ DIAGRAMA: {selected.diagramCode} ]</p>
                  <div className="relative aspect-video rounded-none border-4 border-foreground overflow-hidden bg-background shadow-[4px_4px_0_0_colord(var(--foreground))]">
                    <Image
                      src={`/fichas/${selected.diagramCode}.jpg`}
                      alt={`Diagrama ${selected.diagramCode}`}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!selected && results.length === 0 && query.length < 2 && (
          <div className="text-center py-16 border-4 border-dashed border-foreground/20 bg-background mt-8">
            <Search className="h-16 w-16 mx-auto mb-4 text-foreground/50" />
            <p className="text-lg font-black uppercase tracking-widest text-foreground">BUSQUE UM TORQUE</p>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-2">[ Eixos, Filtro, Motor... ]</p>
          </div>
        )}
      </main>
    </div>
  )
}
