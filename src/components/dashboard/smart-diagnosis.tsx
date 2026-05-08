"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { diagnoseSymptom } from "@/app/actions/diagnosis"
import { DiagnosisResult } from "./diagnosis-result"

export function SmartDiagnosis({ vehicleName }: { vehicleName: string }) {
  const [query, setQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<null | {
    likelyCause: string
    severity: "low" | "medium" | "high"
    recommendation: string
  }>(null)

  const handleDiagnose = async () => {
    if (!query) return
    setIsAnalyzing(true)
    setDiagnosis(null)

    try {
      const result = await diagnoseSymptom(query)
      setDiagnosis(result)
      toast.success("Análise de Diagnóstico Concluída")
    } catch (error) {
      toast.error("Erro ao realizar diagnóstico. Tente novamente.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase italic tracking-tighter">
          <Sparkles className="h-6 w-6" />
          DIAGNÓSTICO TÉCNICO ASSISTIDO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">INPUT DE TELEMETRIA / SINTOMAS</label>
          <div className="flex gap-3">
            <Input 
              placeholder="DESCREVA O COMPORTAMENTO..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-4 border-foreground rounded-none h-14 bg-background font-black uppercase text-sm focus-visible:ring-0 placeholder:opacity-30"
            />
            <Button 
              onClick={handleDiagnose}
              disabled={isAnalyzing || !query}
              className="h-14 w-14 border-4 border-foreground rounded-none bg-foreground text-background hover:bg-background hover:text-foreground shrink-0 transition-none"
            >
              {isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {diagnosis && <DiagnosisResult diagnosis={diagnosis} />}

        <div className="pt-2 flex items-center justify-center gap-4 opacity-40">
          <div className="h-[1px] flex-grow bg-foreground" />
          <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{vehicleName} Expert AI</span>
          <div className="h-[1px] flex-grow bg-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
