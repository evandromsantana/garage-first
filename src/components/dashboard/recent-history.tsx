"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MaintenanceLogSummary } from "@/types"

interface RecentHistoryProps {
  logs: MaintenanceLogSummary[]
}

export function RecentHistory({ logs }: RecentHistoryProps) {
  return (
    <Card className="bg-card border-4 border-foreground rounded-none shadow-none">
      <CardHeader className="pb-3 border-b-2 border-foreground">
        <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Histórico Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {logs.slice(0, 3).map((log) => (
          <Link key={log.id} href={`/maintenance/${log.id}`}>
            <div className="flex items-center justify-between p-3 border-2 border-foreground rounded-none bg-background hover:bg-foreground hover:text-background transition-none mb-3 group">
              <div>
                <p className="text-sm font-bold uppercase">{log.description}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 group-hover:text-background">
                  {new Date(log.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`rounded-none border-2 font-black uppercase text-[10px] tracking-widest ${log.status === "COMPLETED" ? "border-foreground bg-foreground text-background group-hover:border-background group-hover:bg-background group-hover:text-foreground" : "border-dashed border-foreground text-foreground group-hover:border-background group-hover:text-background"}`}>
                  {log.status === "COMPLETED" ? "[ OK ]" : "[ WAIT ]"}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-background" />
              </div>
            </div>
          </Link>
        ))}
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 font-bold uppercase">
            Nenhum registro ainda
          </p>
        )}
      </CardContent>
    </Card>
  )
}
