"use client"

import {
  deleteMaintenanceLog,
  getFirstVehicle,
  getVehicleWithData,
  updateMaintenanceStatus,
} from "@/app/actions"
import { MaintenanceLog } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { toast } from "sonner"

interface UseMaintenanceReturn {
  maintenance: MaintenanceLog | null
  loading: boolean
  handleStatusChange: (newStatus: "COMPLETED" | "PENDING") => Promise<void>
  handleDelete: () => Promise<void>
}

// Hook para buscar dados do veículo com maintenance logs
export function useVehicleMaintenance(vehicleId: string) {
  return useQuery({
    queryKey: ['vehicle', vehicleId, 'maintenance'],
    queryFn: () => getVehicleWithData(vehicleId),
    enabled: !!vehicleId,
    staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
  })
}

// Hook para buscar primeira maintenance por ID
export function useMaintenance(id: string): UseMaintenanceReturn {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Buscar primeiro veículo
  const { data: firstVehicle, isLoading: vehicleLoading } = useQuery({
    queryKey: ['first-vehicle'],
    queryFn: getFirstVehicle,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Buscar dados completos do veículo
  const { data: vehicle, isLoading: dataLoading } = useVehicleMaintenance(
    firstVehicle?.id || ''
  )

  // Encontrar maintenance específica
  const maintenance = vehicle?.maintenanceLogs?.find((m) => m.id === id) || null
  const loading = vehicleLoading || dataLoading

  // Mutation para atualizar status
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: "COMPLETED" | "PENDING") => 
      updateMaintenanceStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', firstVehicle?.id, 'maintenance'] })
      toast.success("Status atualizado com sucesso")
    },
    onError: () => {
      toast.error("Erro ao atualizar status")
    },
  })

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: () => deleteMaintenanceLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', firstVehicle?.id, 'maintenance'] })
      toast.success("Registro excluído")
      router.push("/")
    },
    onError: () => {
      toast.error("Erro ao excluir")
    },
  })

  const handleStatusChange = useCallback(
    async (newStatus: "COMPLETED" | "PENDING") => {
      if (!maintenance) return
      updateStatusMutation.mutate(newStatus)
    },
    [maintenance, updateStatusMutation]
  )

  const handleDelete = useCallback(async () => {
    if (!maintenance || !confirm("Tem certeza que deseja excluir este registro?"))
      return
    deleteMutation.mutate()
  }, [maintenance, deleteMutation])

  return {
    maintenance,
    loading,
    handleStatusChange,
    handleDelete,
  }
}
