"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FAB } from "@/components/fab"
import { GloveMode } from "@/components/glove-mode"
import { ExpenseChart } from "@/components/expense-chart"
import { Bike, Search, TrendingUp, Hand, BookOpen } from "lucide-react"
import Link from "next/link"
import { createMaintenanceLog } from "@/app/actions"
import { toast } from "sonner"
import { DashboardAlerts } from "@/components/dashboard/alerts"
import { DashboardStats } from "@/components/dashboard/stats"
import { PendingTasks } from "@/components/dashboard/pending-tasks"
import { RecentHistory } from "@/components/dashboard/recent-history"
import { VehicleSummary, PendingTask } from "@/types"
import { MAINTENANCE_TYPE_MAP } from "@/lib/constants"
import { calculateVehicleMetrics } from "@/lib/utils"

interface DashboardClientProps {
  vehicle: VehicleSummary
  pending: PendingTask[]
}

export function DashboardClient({ vehicle, pending }: DashboardClientProps) {
  const [gloveMode, setGloveMode] = useState(false)

  const { totalSpent } = calculateVehicleMetrics(vehicle.maintenanceLogs, vehicle.currentKm)

  const handleQuickLog = async (actionName: string) => {
    try {
      await createMaintenanceLog({
        vehicleId: vehicle.id,
        type: MAINTENANCE_TYPE_MAP[actionName] ?? "PREVENTIVE",
        description: actionName,
        kmAtService: vehicle.currentKm,
      })
      toast.success(`${actionName} registrado!`)
    } catch {
      toast.error("Erro ao registrar")
    }
  }

  if (gloveMode) {
    return (
      <GloveMode 
        vehicleId={vehicle.id} 
        onClose={() => setGloveMode(false)}
        onQuickLog={handleQuickLog}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 selection:bg-foreground/10 font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-foreground" />
            <h1 className="text-xl font-black uppercase tracking-tighter">Garage-First</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 px-3 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-none"
              onClick={() => setGloveMode(true)}
            >
              <Hand className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Oficina</span>
              <span className="sm:hidden">Ofic.</span>
            </Button>
            <Link href="/technical">
              <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-foreground hover:text-background rounded-none transition-none">
                <BookOpen className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-foreground hover:text-background rounded-none transition-none">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
          [ Kawasaki Ninja 400 • 2020 ]
        </p>
      </header>

      <main className="p-4 space-y-5">
        <DashboardAlerts vehicle={vehicle} />
        <DashboardStats currentKm={vehicle.currentKm} totalSpent={totalSpent} />
        <PendingTasks pending={pending} />
        <RecentHistory logs={vehicle.maintenanceLogs} />

        <Card className="bg-card border-4 border-foreground rounded-none shadow-none">
          <CardHeader className="pb-3 border-b-2 border-foreground">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análise Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart maintenanceLogs={vehicle.maintenanceLogs} />
          </CardContent>
        </Card>
      </main>

      <FAB />
    </div>
  )
}
