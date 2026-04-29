"use client"

import { useState, useCallback } from "react"
import { MaintenanceType, PartInput } from "@/types"
import { TYPE_SUGGESTIONS } from "@/lib/constants/maintenance"

interface UseMaintenanceFormProps {
  initialType?: MaintenanceType
  initialDescription?: string
  initialKm?: number
  initialParts?: PartInput[]
}

export function useMaintenanceForm({
  initialType = "PREVENTIVE",
  initialDescription = "",
  initialKm = 0,
  initialParts = []
}: UseMaintenanceFormProps = {}) {
  const [type, setType] = useState<MaintenanceType>(initialType)
  const [description, setDescription] = useState(initialDescription)
  const [km, setKm] = useState(initialKm)
  const [parts, setParts] = useState<PartInput[]>(initialParts)

  const addPart = useCallback(() => {
    const newPart: PartInput = {
      id: Date.now().toString(),
      name: "",
      cost: 0,
      isOriginal: false,
    }
    setParts(prev => [...prev, newPart])
  }, [])

  const updatePart = useCallback((id: string, field: keyof PartInput, value: string | number | boolean) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }, [])

  const removePart = useCallback((id: string) => {
    setParts(prev => prev.filter(p => p.id !== id))
  }, [])

  const applySuggestion = useCallback((suggestion: string) => {
    setDescription(suggestion)
  }, [])

  const reset = useCallback(() => {
    setType(initialType)
    setDescription(initialDescription)
    setKm(initialKm)
    setParts(initialParts)
  }, [initialType, initialDescription, initialKm, initialParts])

  const hasUnsavedData = description.trim() !== "" || parts.length > 0

  return {
    // State
    type,
    description,
    km,
    parts,
    hasUnsavedData,

    // Actions
    setType,
    setDescription,
    setKm,
    addPart,
    updatePart,
    removePart,
    applySuggestion,
    reset,

    // Computed
    suggestions: TYPE_SUGGESTIONS[type],
    totalCost: parts.reduce((sum, part) => sum + part.cost, 0),
  }
}
