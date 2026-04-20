"use client"

import { useState, useCallback } from "react"
import { vibrate } from "@/lib/checklists"

interface UseChecklistReturn {
  checkedItems: Record<string, boolean>
  toggleItem: (item: string) => void
  resetChecklist: () => void
  isComplete: (items: string[]) => boolean
  completionPercentage: (items: string[]) => number
}

export function useChecklist(): UseChecklistReturn {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleItem = useCallback((item: string) => {
    vibrate(50)
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }))
  }, [])

  const resetChecklist = useCallback(() => {
    setCheckedItems({})
  }, [])

  const isComplete = useCallback((items: string[]) => {
    return items.every(item => checkedItems[item])
  }, [checkedItems])

  const completionPercentage = useCallback((items: string[]) => {
    if (items.length === 0) return 0
    const checked = items.filter(item => checkedItems[item]).length
    return Math.round((checked / items.length) * 100)
  }, [checkedItems])

  return {
    checkedItems,
    toggleItem,
    resetChecklist,
    isComplete,
    completionPercentage
  }
}
