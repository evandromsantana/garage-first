import { prisma } from "@/lib/db"
import { PageHeader } from "@/components/page-header"
import { requireAuth } from "@/lib/auth-server"
import { MaintenanceLog, ProjectExpense } from "@/types"
import { Activity, BookOpen } from "lucide-react"
import { AnalyticsClient } from "./analytics-client"

import { AuditHeader } from "@/components/analytics/audit-header"
import { FinancialSummary } from "@/components/analytics/financial-summary"
import { QualityMeters } from "@/components/analytics/quality-meters"

export default async function AnalyticsPage() {
  const user = await requireAuth()
  // Buscar veículo e todos os logs em uma única query otimizada
  const vehicle = await prisma.vehicle.findFirst({
    where: { userId: user.id },
    include: {
      maintenanceLogs: {
        include: {
          expenses: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!vehicle) {
    return <div className="kindle-page flex items-center justify-center">Veículo não encontrado</div>
  }

  // Calculate advanced metrics
  const logs = (vehicle.maintenanceLogs || []) as MaintenanceLog[]
  
  const totalSpent = logs.reduce(
    (sum: number, log: MaintenanceLog) => sum + (log.cost ?? 0) + (log.expenses as ProjectExpense[]).reduce((s: number, e: ProjectExpense) => s + e.itemCost, 0),
    0
  )

  const preventiveCount = logs.filter(log => log.type === 'PREVENTIVE').length
  const preventivePercentage = logs.length > 0 
    ? Math.round((preventiveCount / logs.length) * 100) 
    : 0

  const allParts = logs.flatMap(log => log.expenses)
  const oemParts = allParts.filter((part: ProjectExpense) => part.isOriginalPart).length
  const oemPercentage = allParts.length > 0 
    ? Math.round((oemParts / allParts.length) * 100) 
    : 0

  return (
    <div className="kindle-page">
      <PageHeader
        title="Análise de Performance"
        icon={<Activity className="h-6 w-6" />}
        backHref="/dashboard"
      />

      <main className="space-y-8 pt-6">
        <AuditHeader />

        <FinancialSummary 
          totalSpent={totalSpent}
          entryCount={logs.length}
        />

        <QualityMeters 
          oemPercentage={oemPercentage}
          preventivePercentage={preventivePercentage}
        />

        {/* Charts & Interactive Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
            <BookOpen className="h-4 w-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Visualização de Fluxo</h3>
          </div>
          <AnalyticsClient vehicle={vehicle} />
        </section>
      </main>
    </div>
  )
}
