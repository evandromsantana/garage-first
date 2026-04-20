import { Prisma } from '@prisma/client'

// Enums
export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'UPGRADE'
export type MaintenanceStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

// Base Types from Prisma
export type Vehicle = Prisma.VehicleGetPayload<{
  include: {
    maintenanceLogs: {
      include: {
        expenses: true
      }
    }
  }
}>

export type MaintenanceLog = Prisma.MaintenanceLogGetPayload<{
  include: {
    expenses: true
  }
}>

export type ProjectExpense = Prisma.ProjectExpenseGetPayload<object>

export type TechnicalSpec = Prisma.TechnicalSpecGetPayload<object>

// DTO Types for API/Forms
export interface CreateVehicleInput {
  model: string
  year: number
  currentKm?: number
}

export interface CreateMaintenanceInput {
  vehicleId: string
  type: MaintenanceType
  description: string
  kmAtService: number
  cost?: number
  diagramCode?: string
}

export interface CreateExpenseInput {
  maintenanceId: string
  itemName: string
  itemCost: number
  isOriginalPart?: boolean
}

export interface PartInput {
  name: string
  cost: number
  isOriginal: boolean
}

export interface SubmitFullMaintenanceInput {
  vehicleId: string
  type: MaintenanceType
  description: string
  kmAtService: number
  parts: PartInput[]
}

// UI Types
export interface VehicleSummary {
  id: string
  model: string
  year: number
  currentKm: number
  maintenanceLogs: MaintenanceLogSummary[]
}

export interface MaintenanceLogSummary {
  id: string
  type: string
  description: string
  kmAtService: number
  cost: number | null
  status: string
  createdAt: Date
  expenses: { itemCost: number }[]
}

export interface PendingTask {
  id: string
  type: string
  description: string
  kmAtService: number
}

export interface PredictiveRule {
  keyword: string
  lifespan: number
  name: string
}

export interface MaintenanceAlert {
  name: string
  remaining: number
  isOverdue: boolean
}

// Dashboard Types
export interface DashboardData {
  vehicle: VehicleSummary
  pending: PendingTask[]
  totalSpent: number
  costPerKm: number
}
