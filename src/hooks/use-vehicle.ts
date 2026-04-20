"use client"

import { useState, useCallback } from "react"
import { updateVehicleKm as updateVehicleKmAction } from "@/app/actions"

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

export function useVehicleKm({
  vehicleId,
  initialKm,
}: UseVehicleKmProps): UseVehicleKmReturn {
  const [km, setKm] = useState(initialKm)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateKm = useCallback(
    async (newKm: number) => {
      if (newKm === km) return

      setIsUpdating(true)
      setError(null)

      try {
        await updateVehicleKmAction(vehicleId, newKm)
        setKm(newKm)
      } catch {
        setError("Erro ao atualizar odômetro")
      } finally {
        setIsUpdating(false)
      }
    },
    [vehicleId, km]
  )

  return { km, isUpdating, updateKm, error }
}
