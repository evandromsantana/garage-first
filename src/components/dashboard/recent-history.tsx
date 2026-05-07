"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MaintenanceLogSummary } from "@/types"

interface RecentHistoryProps {
  logs: MaintenanceLogSummary[]
}

export function RecentHistory({ logs = [] }: RecentHistoryProps) {
  return (
    <Card className="kindle-card">
      <CardHeader className="pb-4 border-b-4 border-foreground">
        <CardTitle className="text-xl font-black uppercase flex items-center gap-2 italic">
          <Wrench className="h-6 w-6" />
          Índice de Manutenções
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y-2 divide-foreground">
        {logs.slice(0, 5).map((log, index) => (
          <Link key={log.id} href={`/maintenance/${log.id}`} className="block group">
            <div className="flex items-center justify-between p-5 hover:bg-foreground hover:text-background transition-none">
              <div className="flex gap-4 items-baseline">
                <span className="font-mono text-xs opacity-50">0{index + 1}</span>
                <div className="space-y-1">
                  <p className="text-lg font-black uppercase leading-none tracking-tight">{log.description}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                    Pág. {log.kmAtService} KM • {new Date(log.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 opacity-30 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
        {logs.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest opacity-30">
              Nenhum capítulo registrado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
