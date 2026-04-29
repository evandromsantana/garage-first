"use client"

import { Bike } from "lucide-react"
import { VehicleSummary } from "@/types"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

interface DashboardHeaderProps {
  vehicle: VehicleSummary
  onQuickLog?: (actionName: string) => void
}

export function DashboardHeader({ vehicle, onQuickLog }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bike className="h-8 w-8 text-foreground" />
          <h1 className="text-xl font-black uppercase tracking-tighter">Garage-First</h1>
        </div>
        <DarkModeToggle />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
        [ {vehicle.model} • {vehicle.year} ]
      </p>
    </header>
  )
}
