"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  getVehicleWithData,
  updateMaintenanceStatus,
  deleteMaintenanceLog,
  getFirstVehicle,
} from "@/app/actions"
import { MaintenanceLog } from "@/types"

interface UseMaintenanceReturn {
  maintenance: MaintenanceLog | null
  loading: boolean
  handleStatusChange: (newStatus: "COMPLETED" | "PENDING") => Promise<void>
  handleDelete: () => Promise<void>
}

export function useMaintenance(id: string): UseMaintenanceReturn {
  const router = useRouter()
  const [maintenance, setMaintenance] = useState<MaintenanceLog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const baseVehicle = await getFirstVehicle()
        if (baseVehicle) {
          const vehicle = await getVehicleWithData(baseVehicle.id)
          if (vehicle?.maintenanceLogs) {
            const found = vehicle.maintenanceLogs.find((m) => m.id === id)
            if (found) {
              setMaintenance(found)
            }
          }
        }
      } catch {
        toast.error("Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleStatusChange = useCallback(
    async (newStatus: "COMPLETED" | "PENDING") => {
      if (!maintenance) return
      try {
        await updateMaintenanceStatus(maintenance.id, newStatus)
        setMaintenance({ ...maintenance, status: newStatus })
        toast.success(
          `Status atualizado para ${newStatus === "COMPLETED" ? "Concluído" : "Pendente"}`
        )
      } catch {
        toast.error("Erro ao atualizar status")
      }
    },
    [maintenance]
  )

  const handleDelete = useCallback(async () => {
    if (!maintenance || !confirm("Tem certeza que deseja excluir este registro?"))
      return
    try {
      await deleteMaintenanceLog(maintenance.id)
      toast.success("Registro excluído")
      router.push("/")
    } catch {
      toast.error("Erro ao excluir")
    }
  }, [maintenance, router])

  return {
    maintenance,
    loading,
    handleStatusChange,
    handleDelete,
  }
}
