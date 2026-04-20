"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Check, X } from "lucide-react"
import { updateMaintenanceStatus } from "@/app/actions"
import { toast } from "sonner"
import { PendingTask } from "@/types"
import { formatNumber } from "@/lib/utils"

interface PendingTasksProps {
  pending: PendingTask[]
}

const TYPE_STYLES: Record<string, string> = {
  PREVENTIVE: "border-foreground font-black uppercase tracking-widest",
  CORRECTIVE: "border-foreground bg-foreground text-background font-black uppercase tracking-widest",
  UPGRADE: "border-dashed border-foreground bg-muted font-black uppercase tracking-widest"
}

export function PendingTasks({ pending }: PendingTasksProps) {
  return (
    <Card className="bg-card border-4 border-foreground rounded-none shadow-none">
      <CardHeader className="pb-3 border-b-2 border-foreground">
        <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Tarefas / Peças Pendentes
          <Badge variant="outline" className="ml-auto rounded-none border-2 border-foreground font-black">
            {pending.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 font-bold uppercase">
            Nenhuma tarefa pendente
          </p>
        ) : (
          pending.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border-2 border-dashed border-foreground/30 rounded-none bg-background group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-none ${TYPE_STYLES[item.type] ?? TYPE_STYLES.PREVENTIVE}`}
                  >
                    {item.type === "PREVENTIVE" && "Preventiva"}
                    {item.type === "CORRECTIVE" && "Corretiva"}
                    {item.type === "UPGRADE" && "Upgrade"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase">{item.description}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase opacity-80">
                    KM {formatNumber(item.kmAtService)}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    await updateMaintenanceStatus(item.id, 'COMPLETED')
                    toast.success("Tarefa concluída!")
                  }} 
                  className="h-8 w-8 px-0 rounded-none border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background"
                  title="Marcar como Completo"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    if(confirm("Deseja cancelar esta tarefa?")) {
                      await updateMaintenanceStatus(item.id, 'CANCELLED')
                      toast("Tarefa cancelada.")
                    }
                  }} 
                  className="h-8 w-8 px-0 rounded-none border-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-background"
                  title="Cancelar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
        {pending.length > 5 && (
          <Button variant="ghost" className="w-full text-sm font-bold uppercase">
            Ver mais {pending.length - 5}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
