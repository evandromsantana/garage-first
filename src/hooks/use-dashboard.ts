"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFirstVehicle, getVehicleWithData } from "@/app/actions"
import { toast } from "sonner"

// Hook para dados principais do dashboard
export function useDashboard() {
  const queryClient = useQueryClient()

  // Buscar primeiro veículo
  const { data: firstVehicle, isLoading: vehicleLoading, error: vehicleError } = useQuery({
    queryKey: ['first-vehicle'],
    queryFn: getFirstVehicle,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })

  // Buscar dados completos do veículo
  const { data: vehicle, isLoading: dataLoading, error: dataError } = useQuery({
    queryKey: ['vehicle', firstVehicle?.id, 'full'],
    queryFn: () => getVehicleWithData(firstVehicle?.id || ''),
    enabled: !!firstVehicle?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
    retry: 2,
  })

  const loading = vehicleLoading || dataLoading
  const error = vehicleError || dataError

  // Mutation para refresh manual dos dados
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['first-vehicle'] })
      await queryClient.invalidateQueries({ queryKey: ['vehicle', firstVehicle?.id, 'full'] })
    },
    onSuccess: () => {
      toast.success("Dados atualizados")
    },
    onError: () => {
      toast.error("Erro ao atualizar dados")
    },
  })

  // Dados processados para o dashboard
  const dashboardData = {
    vehicle: vehicle,
    maintenanceLogs: vehicle?.maintenanceLogs || [],
    expenses: vehicle?.expenses || [],
    healthScore: calculateHealthScore(vehicle),
    nextMaintenance: getNextMaintenance(vehicle),
    totalCosts: calculateTotalCosts(vehicle),
    recentActivity: getRecentActivity(vehicle),
  }

  return {
    ...dashboardData,
    loading,
    error,
    refresh: refreshMutation.mutate,
    isRefreshing: refreshMutation.isPending,
  }
}

// Funções utilitárias para cálculos do dashboard
function calculateHealthScore(vehicle: any): number {
  if (!vehicle?.maintenanceLogs?.length) return 100

  const totalMaintenance = vehicle.maintenanceLogs.length
  const completedMaintenance = vehicle.maintenanceLogs.filter(
    (log: any) => log.status === 'COMPLETED'
  ).length
  
  const completionRate = (completedMaintenance / totalMaintenance) * 100
  
  // Fator de quilometragem (se está muito acima da média)
  const avgKmBetweenMaintenance = 5000 // valor padrão
  const lastMaintenance = vehicle.maintenanceLogs
    .filter((log: any) => log.status === 'COMPLETED')
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  
  let kmScore = 100
  if (lastMaintenance && vehicle.currentKm > lastMaintenance.kmAtService) {
    const kmSinceLast = vehicle.currentKm - lastMaintenance.kmAtService
    if (kmSinceLast > avgKmBetweenMaintenance * 1.5) {
      kmScore = Math.max(60, 100 - (kmSinceLast - avgKmBetweenMaintenance) / 100)
    }
  }
  
  return Math.round((completionRate + kmScore) / 2)
}

function getNextMaintenance(vehicle: any): Date | null {
  if (!vehicle?.maintenanceLogs?.length) return null

  const pendingMaintenance = vehicle.maintenanceLogs
    .filter((log: any) => log.status === 'PENDING')
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return pendingMaintenance.length > 0 ? new Date(pendingMaintenance[0].date) : null
}

function calculateTotalCosts(vehicle: any): {
  total: number
  thisMonth: number
  lastMonth: number
} {
  const expenses = vehicle?.expenses || []
  const maintenanceCosts = vehicle?.maintenanceLogs?.reduce((sum: number, log: any) => 
    sum + (log.cost || 0), 0) || 0

  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
  const total = totalExpenses + maintenanceCosts

  const now = new Date()
  const thisMonth = expenses
    .filter((exp: any) => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum: number, exp: any) => sum + exp.amount, 0)

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const lastMonthExpenses = expenses
    .filter((exp: any) => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear()
    })
    .reduce((sum: number, exp: any) => sum + exp.amount, 0)

  return {
    total,
    thisMonth,
    lastMonth: lastMonthExpenses,
  }
}

function getRecentActivity(vehicle: any): Array<{
  id: string
  type: 'maintenance' | 'expense'
  title: string
  date: Date
  amount?: number
}> {
  const activities: any[] = []

  // Adicionar maintenances recentes
  vehicle?.maintenanceLogs?.forEach((log: any) => {
    activities.push({
      id: log.id,
      type: 'maintenance',
      title: log.description,
      date: new Date(log.date),
      amount: log.cost,
    })
  })

  // Adicionar expenses recentes
  vehicle?.expenses?.forEach((exp: any) => {
    activities.push({
      id: exp.id,
      type: 'expense',
      title: exp.description || exp.category,
      date: new Date(exp.date),
      amount: exp.amount,
    })
  })

  // Ordenar por data (mais recente primeiro) e limitar a 10
  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)
}
