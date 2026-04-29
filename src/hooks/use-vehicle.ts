"use client"

import { useState, useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateVehicleKm as updateVehicleKmAction, getVehicleWithData } from "@/app/actions"

interface UseVehicleKmProps {
  vehicleId: string
  initialKm: number
}

interface UseVehicleKmReturn {
  km: number
  isUpdating: boolean
  updateKm: (newKm: number) => Promise<void>
  error: string | null
}

// Hook para buscar dados do veículo com cache
export function useVehicle(vehicleId: string) {
  return useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => getVehicleWithData(vehicleId),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para atualizar quilometragem com TanStack Query
export function useVehicleKm({
  vehicleId,
  initialKm,
}: UseVehicleKmProps): UseVehicleKmReturn {
  const queryClient = useQueryClient()
  
  // Buscar dados atualizados do veículo
  const { data: vehicle } = useVehicle(vehicleId)
  
  // Mutation para atualizar KM
  const updateKmMutation = useMutation({
    mutationFn: (newKm: number) => updateVehicleKmAction(vehicleId, newKm),
    onSuccess: () => {
      // Invalidar cache do veículo para buscar dados atualizados
      queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] })
    },
    onError: () => {
      // Erro será tratado no estado local
    },
  })

  const km = vehicle?.currentKm ?? initialKm
  const isUpdating = updateKmMutation.isPending
  const error = updateKmMutation.error ? "Erro ao atualizar odômetro" : null

  const updateKm = useCallback(
    async (newKm: number) => {
      if (newKm === km) return
      updateKmMutation.mutate(newKm)
    },
    [km, updateKmMutation]
  )

  return { km, isUpdating, updateKm, error }
}
