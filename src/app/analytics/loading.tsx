import { PageHeader } from "@/components/page-header"
import { Activity } from "lucide-react"

export default function Loading() {
  return (
    <div className="kindle-page">
      <PageHeader
        title="Análise de Performance"
        icon={<Activity className="h-6 w-6" />}
        backHref="/dashboard"
      />
      
      <main className="space-y-8 pt-6">
        {/* Skeleton for AuditHeader */}
        <div className="h-24 w-full bg-muted animate-pulse border-4 border-foreground/10" />
        
        {/* Skeleton for FinancialSummary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted animate-pulse border-4 border-foreground/10" />
          <div className="h-32 bg-muted animate-pulse border-4 border-foreground/10" />
        </div>
        
        {/* Skeleton for Charts */}
        <div className="h-64 w-full bg-muted animate-pulse border-4 border-foreground/10" />
      </main>
    </div>
  )
}
