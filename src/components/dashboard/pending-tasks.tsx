"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Check, X } from "lucide-react"
import { updateMaintenanceStatus } from "@/app/actions"
import { toast } from "sonner"
import { PendingTask } from "@/types"
import { formatNumber } from "@/lib/utils"

interface PendingTasksProps {
  pending: PendingTask[]
}

export function PendingTasks({ pending }: PendingTasksProps) {
  return (
    <Card className="kindle-card">
      <CardHeader className="pb-4 border-b-4 border-foreground">
        <CardTitle className="text-xl font-black uppercase italic flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tarefas em Aberto
          </div>
          <span className="font-mono text-sm bg-foreground text-background px-2 py-0.5">{pending.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y-2 divide-foreground">
        {pending.length === 0 ? (
          <div className="p-10 text-center text-xs font-black uppercase opacity-20 italic">
            Nenhum procedimento pendente catalogado.
          </div>
        ) : (
          pending.map((item) => (
            <div
              key={item.id}
              className="p-5 flex items-center justify-between bg-background hover:bg-muted/10 transition-none"
            >
              <div className="space-y-1">
                <p className="text-lg font-black uppercase italic leading-none">{item.description}</p>
                <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest opacity-40">
                  <span>KM {formatNumber(item.kmAtService)}</span>
                  <span>•</span>
                  <span>{item.type}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    await updateMaintenanceStatus(item.id, 'COMPLETED')
                    toast.success("Procedimento Concluído")
                  }} 
                  className="h-12 w-12 rounded-none border-4 border-foreground bg-background hover:bg-foreground hover:text-background transition-all shadow-[2px_2px_0_0_var(--foreground)] active:shadow-none active:translate-y-0.5"
                >
                  <Check className="h-6 w-6" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    if(confirm("Cancelar este registro técnico?")) {
                      await updateMaintenanceStatus(item.id, 'CANCELLED')
                      toast("Registro Cancelado")
                    }
                  }} 
                  className="h-12 w-12 rounded-none border-4 border-foreground/10 text-muted-foreground hover:border-foreground hover:text-foreground transition-none"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
