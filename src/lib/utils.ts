import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MaintenanceLogSummary } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
}

// Number formatting
export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR")
}

// Calculate total spent from maintenance logs
export function calculateTotalSpent(logs: MaintenanceLogSummary[]): number {
  return logs.reduce(
    (acc, log) => acc + (log.cost || 0) + log.expenses.reduce((e, exp) => e + exp.itemCost, 0),
    0
  )
}

// Calculate cost per KM
export function calculateCostPerKm(totalSpent: number, currentKm: number): number {
  return currentKm > 0 ? (totalSpent / currentKm) : 0
}

// Calculate both metrics at once
export function calculateVehicleMetrics(logs: MaintenanceLogSummary[], currentKm: number) {
  const totalSpent = calculateTotalSpent(logs)
  const costPerKm = calculateCostPerKm(totalSpent, currentKm)

  return { totalSpent, costPerKm }
}
