"use client"

import { ProjectExpense, VehicleSummary } from "@/types"
import { useEffect, useMemo, useState } from "react"

interface VehicleMetrics {
  totalSpent: number
  totalMaintenance: number
  averageCostPerMaintenance: number
  lastMaintenanceDate: Date | null
  nextMaintenanceKm: number | null
  daysSinceLastMaintenance: number | null
  partsUsed: number
  originalPartsRatio: number
}

export function useVehicleMetrics(vehicle: VehicleSummary): VehicleMetrics {
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60 * 1000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const staticMetrics = useMemo(() => {
    const { maintenanceLogs } = vehicle

    // Calculate total spent
    const totalSpent = maintenanceLogs.reduce(
      (sum, log) => sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0),
      0
    )

    // Total maintenance count
    const totalMaintenance = maintenanceLogs.length

    // Average cost per maintenance
    const averageCostPerMaintenance = totalMaintenance > 0 ? totalSpent / totalMaintenance : 0

    // Last maintenance date
    const lastMaintenanceDate = maintenanceLogs.length > 0
      ? new Date(Math.max(...maintenanceLogs.map(log => new Date(log.createdAt).getTime())))
      : null

    // Calculate next maintenance based on predictive rules
    const nextMaintenanceKm = maintenanceLogs.reduce((nextKm, log) => {
      const nextForThisLog = log.kmAtService + 5000 // Default 5000km interval
      return nextKm === null ? nextForThisLog : Math.min(nextKm, nextForThisLog)
    }, null as number | null)

    // Parts statistics
    const allParts = maintenanceLogs.flatMap(log => log.expenses as ProjectExpense[])
    const partsUsed = allParts.length
    const originalPartsRatio = partsUsed > 0
      ? allParts.filter(part => part.isOriginalPart).length / partsUsed
      : 0

    return {
      totalSpent,
      totalMaintenance,
      averageCostPerMaintenance,
      lastMaintenanceDate,
      nextMaintenanceKm,
      partsUsed,
      originalPartsRatio,
    }
  }, [vehicle])

  // Calculate days since last maintenance using current time from state
  const daysSinceLastMaintenance = staticMetrics.lastMaintenanceDate
    ? Math.floor((currentTime - staticMetrics.lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24))
    : null

  return {
    ...staticMetrics,
    daysSinceLastMaintenance,
  }
}
