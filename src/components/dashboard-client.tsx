"use client"

import { createMaintenanceLog } from "@/app/actions"
import { DashboardHeader } from "@/components/dashboard/header"
import { InventoryAlertWidget } from "@/components/dashboard/inventory-alert-widget"
import { LazyMaintenanceForecastWrapper } from "@/components/dashboard/lazy-components"
import { DashboardMetrics } from "@/components/dashboard/metrics"
import { OBD2Widget } from "@/components/dashboard/obd2-widget"
import { PendingTasks } from "@/components/dashboard/pending-tasks"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentHistory } from "@/components/dashboard/recent-history"
import { SmartDiagnosis } from "@/components/dashboard/smart-diagnosis"
import { VehicleSkeleton } from "@/components/dashboard/vehicle-skeleton"
import { FAB } from "@/components/fab"
import { GloveMode } from "@/components/glove-mode"
import { VoiceAgent } from "@/components/voice-agent"
import { usePredictiveMaintenance, useSmartAlerts } from "@/hooks"
import { MAINTENANCE_TYPE_MAP } from "@/lib/constants/maintenance"
import { haptics } from "@/lib/haptics"
import { InventoryItem, PendingTask, TechnicalSpec, VehicleSummary } from "@/types"
import { Plus, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface DashboardClientProps {
  vehicle: VehicleSummary
  pending: PendingTask[]
  inventory: InventoryItem[]
  specs: TechnicalSpec[]
}

export default function DashboardClient({ vehicle, pending, inventory, specs }: DashboardClientProps) {
  const [isGloveModeOpen, setIsGloveModeOpen] = useState(false)
  const predictiveData = usePredictiveMaintenance(vehicle?.maintenanceLogs || [], vehicle?.currentKm || 0)
  const { alerts, unreadCount, criticalCount, markAsRead, markAllAsRead, clearAlerts } = useSmartAlerts(vehicle, predictiveData.insights)

  useEffect(() => {
    if (vehicle.maintenanceLogs.length === 0) {
      toast.success("Bem-vindo, Ninja! Veículo pronto para auditoria técnica.", {
        icon: "🏍️",
        duration: 5000,
        id: "welcome-ninja" // Add ID to prevent duplicates
      })
    }
  }, [vehicle.maintenanceLogs.length])

  if (!vehicle) return null

  const handleQuickLog = async (type: string) => {
    try {
      await createMaintenanceLog({
        vehicleId: vehicle.id,
        description: type,
        kmAtService: vehicle.currentKm,
        type: (MAINTENANCE_TYPE_MAP[type as keyof typeof MAINTENANCE_TYPE_MAP] || 'PREVENTIVE') as "PREVENTIVE" | "CORRECTIVE" | "UPGRADE",
        cost: 0,
      })
      toast.success(`${type} registrado!`)
    } catch (error) {
      toast.error("Erro ao registrar manutenção rápida")
    }
  }

  return (
    <div className="kindle-page space-y-8">
      <DashboardHeader 
        vehicleName={vehicle.model}
        alerts={alerts}
        unreadCount={unreadCount}
        criticalCount={criticalCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAlerts={clearAlerts}
      />

      <main className="max-w-4xl mx-auto space-y-10 pb-20">
        
        {/* Core Vehicle Stats & Inspection */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardMetrics vehicle={vehicle} />
          <VehicleSkeleton health={predictiveData.healthScore} />
        </section>

        {/* Quick Actions Grid */}
        <QuickActions />

        {/* Predictive Intelligence */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
             <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
               <ShieldCheck className="h-4 w-4" />
               <h3 className="text-xs font-black uppercase tracking-widest">Inteligência Preditiva</h3>
             </div>
             <SmartDiagnosis />
             <InventoryAlertWidget items={inventory} />
             <LazyMaintenanceForecastWrapper insights={predictiveData.insights} nextMaintenanceDate={predictiveData.nextMaintenanceDate} />
           </div>
           
           <div className="space-y-4">
             <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
               <Plus className="h-4 w-4" />
               <h3 className="text-xs font-black uppercase tracking-widest">Diagnóstico Externo</h3>
             </div>
             <OBD2Widget />
           </div>
        </section>

        {/* History Archive */}
        <RecentHistory logs={vehicle.maintenanceLogs} />

        {/* Pending Logs / Tasks */}
        {pending.length > 0 && <PendingTasks pending={pending} />}

      </main>

      <FAB onClick={() => { haptics.heavy(); setIsGloveModeOpen(true); }} />

      {isGloveModeOpen && (
        <GloveMode 
          vehicleId={vehicle.id} 
          specs={specs}
          onClose={() => setIsGloveModeOpen(false)}
          onQuickLog={handleQuickLog}
        />
      )}
      
      <VoiceAgent />
    </div>
  )
}
