import { prisma } from "@/lib/db"
import { PageHeader } from "@/components/page-header"
import { Wrench, Plus, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatCurrency } from "@/lib"

export default async function MaintenancePage() {
  const { requireAuth } = await import('@/lib/auth-server')
  const user = await requireAuth()

  // Buscar veículo e logs em uma única query
  const vehicle = await prisma.vehicle.findFirst({
    where: { userId: user.id },
    include: {
      maintenanceLogs: {
        include: { expenses: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!vehicle) {
    return (
      <div className="kindle-page flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-black uppercase">Nenhum veículo encontrado</p>
        <Link href="/setup">
          <Button className="kindle-button">Cadastrar Veículo</Button>
        </Link>
      </div>
    )
  }

  const logs = vehicle.maintenanceLogs || []

  return (
    <div className="kindle-page">
      <PageHeader 
        title="Oficina" 
        icon={<Wrench className="h-6 w-6" />} 
        backHref="/dashboard" 
      />

      <main className="space-y-6 pt-4">
        {/* Quick Action Header */}
        <div className="kindle-card bg-foreground text-background flex items-center justify-between p-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Histórico Técnico</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
              {logs.length} Registros de Procedência
            </p>
          </div>
          <Link href="/maintenance/new">
            <Button className="h-14 w-14 bg-background text-foreground border-2 border-background p-0 rounded-none hover:bg-muted transition-none">
              <Plus className="h-8 w-8" />
            </Button>
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="kindle-card bg-muted/30">
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Total Investido</p>
            <p className="text-xl font-black">
              {formatCurrency(logs.reduce((acc, log) => acc + (log.cost ?? 0) + log.expenses.reduce((eAcc, e) => eAcc + e.itemCost, 0), 0))}
            </p>
          </div>
          <div className="kindle-card bg-muted/30">
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Última Revisão</p>
            <p className="text-xl font-black">
              {logs[0] ? `${logs[0].kmAtService} KM` : "N/A"}
            </p>
          </div>
        </div>

        {/* Full Archive List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
            <History className="h-4 w-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Arquivo Completo</h3>
          </div>

          <div className="divide-y-4 divide-foreground border-b-4 border-foreground">
            {logs.map((log, index) => (
              <Link key={log.id} href={`/maintenance/${log.id}`} className="block group">
                <div className="py-6 flex items-start justify-between bg-background hover:bg-muted transition-none">
                  <div className="flex gap-6">
                    <span className="font-mono text-sm opacity-30 mt-1">
                      {(logs.length - index).toString().padStart(2, '0')}
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black uppercase leading-none">{log.description}</h4>
                        {log.status === 'COMPLETED' ? (
                          <span className="text-[8px] font-black border border-foreground px-1 py-0.5">FINALIZADO</span>
                        ) : (
                          <span className="text-[8px] font-black border border-dashed border-foreground px-1 py-0.5">PENDENTE</span>
                        )}
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        <span>{new Date(log.createdAt).toLocaleDateString("pt-BR")}</span>
                        <span>•</span>
                        <span>{log.kmAtService} KM</span>
                        <span>•</span>
                        <span className="text-foreground">{log.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black italic">
                      {formatCurrency((log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            
            {logs.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-foreground/20">
                <p className="text-sm font-bold uppercase tracking-widest opacity-30">
                  Nenhum registro no arquivo técnico
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
