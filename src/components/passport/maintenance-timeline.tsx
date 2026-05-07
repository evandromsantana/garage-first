import { formatCurrency } from "@/lib"
import { Calendar } from "lucide-react"

interface MaintenanceTimelineProps {
  logs: any[]
}

export function MaintenanceTimeline({ logs }: MaintenanceTimelineProps) {
  return (
    <section className="space-y-6">
       <div className="flex items-center gap-2 border-b-4 border-foreground pb-2">
         <Calendar className="h-5 w-5" />
         <h2 className="text-lg font-black uppercase italic">CRONOLOGIA DE MANUTENÇÃO</h2>
       </div>

       <div className="relative border-l-4 border-foreground ml-4 pl-8 space-y-10 py-4">
          {logs.length === 0 ? (
            <div className="text-center p-10 opacity-30 italic uppercase font-black text-sm">
               Nenhum registro encontrado no banco de dados.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="relative group animate-in slide-in-from-left-4 duration-500">
                <div className="absolute -left-[42px] top-1 h-6 w-6 rounded-full bg-foreground border-4 border-zinc-50 flex items-center justify-center">
                   <div className="h-2 w-2 bg-zinc-50 rounded-full" />
                </div>
                
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-xl font-black uppercase tracking-tighter">{log.description}</span>
                      <span className="font-mono text-xs font-black bg-zinc-200 px-2 py-0.5">{log.kmAtService.toLocaleString()} KM</span>
                   </div>
                   <div className="flex gap-4 text-[10px] font-black opacity-60 uppercase tracking-widest">
                      <span>📅 {new Date(log.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span>🛠️ {log.type}</span>
                      <span>💰 {formatCurrency(log.cost || 0)}</span>
                   </div>
                   
                   {log.expenses && log.expenses.length > 0 && (
                     <div className="mt-3 p-3 bg-white border-2 border-foreground/10 rounded-none space-y-1">
                        <p className="text-[9px] font-black opacity-40 mb-1">LISTA DE COMPONENTES SUBSTITUÍDOS:</p>
                        {log.expenses.map((exp: any, i: number) => (
                          <div key={i} className="flex justify-between text-[10px] font-bold uppercase">
                            <span>• {exp.itemName}</span>
                            <span>{formatCurrency(exp.itemCost)}</span>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            ))
          )}
       </div>
    </section>
  )
}
