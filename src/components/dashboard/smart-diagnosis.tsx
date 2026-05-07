"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { DiagnosisResult } from "./diagnosis-result"

export function SmartDiagnosis() {
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const q = query.toLowerCase()
      if (q.includes("barulho") || q.includes("metal") || q.includes("batendo")) {
        setDiagnosis({
          likelyCause: "ANOMALIA MECÂNICA: CABEÇOTE / VALVULÁRIO",
          severity: "medium",
          recommendation: "REQUISITADO: INSPEÇÃO DE FOLGA DE VÁLVULAS. TORQUE PADRÃO: 12NM."
        })
      } else if (q.includes("pneu") || q.includes("instável") || q.includes("vibra")) {
        setDiagnosis({
          likelyCause: "INSTABILIDADE DINÂMICA: RODAGEM",
          severity: "low",
          recommendation: "REQUISITADO: VERIFICAR TWI (DESGASTE) E REALIZAR BALANCEAMENTO ESTÁTICO."
        })
      } else if (q.includes("liga") || q.includes("partida") || q.includes("bateria")) {
        setDiagnosis({
          likelyCause: "FALHA ELÉTRICA CRÍTICA: SISTEMA DE CARGA",
          severity: "high",
          recommendation: "REQUISITADO: TESTE DE ESTATOR E RETIFICADOR. VOLTAGEM EM REPOUSO > 12.6V."
        })
      } else {
        setDiagnosis({
          likelyCause: "ANOMALIA TÉCNICA NÃO CATALOGADA",
          severity: "medium",
          recommendation: "REQUISITADO: VARREDURA OBD2 COMPLETA E CHECAGEM DE CÓDIGOS DE ERRO ATIVOS."
        })
      }
      toast.success("Análise de Diagnóstico Concluída")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="kindle-card">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic tracking-tighter">
          <Sparkles className="h-6 w-6" />
          DIAGNÓSTICO TÉCNICO ASSISTIDO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
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
          <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Ninja 400 Expert AI</span>
          <div className="h-[1px] flex-grow bg-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
