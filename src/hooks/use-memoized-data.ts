/**
 * Memoized Data Hooks - Hooks com memoização para otimizar performance
 * Evita re-renderizações desnecessárias e cache de dados
 */

import { MaintenanceLog, VehicleSummary } from '@/types'
import { useCallback, useMemo, useRef, useState } from 'react'

// Hook para memoizar cálculos de métricas
export function useMemoizedMetrics(vehicle: VehicleSummary) {
  const maintenanceLogs = vehicle.maintenanceLogs || []
  const currentKm = vehicle.currentKm || 0

  // Total gasto
  const totalSpent = useMemo(() => 
    maintenanceLogs.reduce(
      (sum, log) => sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0),
      0
    ),
    [maintenanceLogs]
  )

  // Total de manutenções
  const totalMaintenance = maintenanceLogs.length

  // Custo médio por manutenção
  const averageCostPerMaintenance = totalMaintenance > 0 ? totalSpent / totalMaintenance : 0

  // Custo por KM
  const costPerKm = currentKm > 0 ? totalSpent / currentKm : 0

  // Última manutenção
  const lastMaintenanceDate = useMemo(() =>
    maintenanceLogs.length > 0
      ? new Date(Math.max(...maintenanceLogs.map(log => new Date(log.createdAt).getTime())))
      : null,
    [maintenanceLogs]
  )

  // Dias desde última manutenção
  const daysSinceLastMaintenance = lastMaintenanceDate
    ? Math.floor((Date.now() - lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Estatísticas de peças
  const allParts = maintenanceLogs.flatMap(log => log.expenses)
  const partsUsed = allParts.length
  const originalPartsRatio = partsUsed > 0
    ? allParts.filter(part => part.isOriginalPart).length / partsUsed
    : 0

  // Manutenções por tipo
  const maintenanceByType = useMemo(() => 
    maintenanceLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    [maintenanceLogs]
  )

  // Tendências de custo
  const costTrend = useMemo(() => {
    const sortedLogs = [...maintenanceLogs].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    
    return sortedLogs.slice(-6).map((log, index) => ({
      index,
      cost: log.cost ?? 0 + log.expenses.reduce((s, e) => s + e.itemCost, 0),
      date: new Date(log.createdAt).toLocaleDateString('pt-BR')
    }))
  }, [maintenanceLogs])

  return useMemo(() => ({
    totalSpent,
    totalMaintenance,
    averageCostPerMaintenance,
    costPerKm,
    lastMaintenanceDate,
    daysSinceLastMaintenance,
    partsUsed,
    originalPartsRatio,
    maintenanceByType,
    costTrend
  }), [
    totalSpent,
    totalMaintenance,
    averageCostPerMaintenance,
    costPerKm,
    lastMaintenanceDate,
    daysSinceLastMaintenance,
    partsUsed,
    originalPartsRatio,
    maintenanceByType,
    costTrend,
    vehicle
  ])
}

// Hook para memoizar filtros de manutenção
export function useMemoizedMaintenanceFilters(logs: MaintenanceLog[]) {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const typeMatch = filterType === 'all' || log.type === filterType
      const statusMatch = filterStatus === 'all' || log.status === filterStatus
      return typeMatch && statusMatch
    })
  }, [logs, filterType, filterStatus])

  const filterOptions = useMemo(() => {
    const types = [...new Set(logs.map(log => log.type))]
    const statuses = [...new Set(logs.map(log => log.status))]
    
    return {
      types: ['all', ...types],
      statuses: ['all', ...statuses]
    }
  }, [logs])

  return {
    filteredLogs,
    filterOptions,
    filterType,
    filterStatus,
    setFilterType,
    setFilterStatus
  }
}

// Hook para memoizar busca e ordenação
export function useMemoizedSearch<T extends Record<string, any>>(items: T[], searchFields: (keyof T & string)[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof T | ''>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items

    // Aplicar filtro de busca
    if (searchTerm) {
      filtered = items.filter(item =>
        searchFields.some(field =>
          (item[field] as any)?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Aplicar ordenação
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [items, searchTerm, searchFields, sortBy, sortOrder])

  const toggleSort = useCallback((field: keyof T & string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }, [sortBy, sortOrder])

  return {
    filteredAndSortedItems,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    toggleSort
  }
}

// Hook para memoizar cálculos de analytics
export function useMemoizedAnalytics(vehicle: VehicleSummary) {
  const maintenanceLogs = vehicle.maintenanceLogs || []
  const currentKm = vehicle.currentKm || 0

  // Análise temporal
  const monthlySpending = useMemo(() => {
    const monthlyData = maintenanceLogs.reduce((acc, log) => {
      const month = new Date(log.createdAt).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      })
      
      if (!acc[month]) {
        acc[month] = 0
      }
      
      acc[month] += (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0)
      return acc
    }, {} as Record<string, number>)

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    })).slice(-12) // Últimos 12 meses
  }, [maintenanceLogs])

  // Previsão de custos
  const projectedCosts = useMemo(() => {
    const avgMonthlyCost = monthlySpending.reduce((sum, item) => sum + item.amount, 0) / Math.max(monthlySpending.length, 1)
    const annualProjection = avgMonthlyCost * 12
    
    return {
      monthly: avgMonthlyCost,
      annual: annualProjection,
      next6Months: avgMonthlyCost * 6
    }
  }, [monthlySpending])

  // Padrão de uso
  const usagePattern = useMemo(() => {
    if (maintenanceLogs.length < 2) return 'insufficient_data'
    
    const sortedLogs = [...maintenanceLogs].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    
    const intervals = []
    for (let i = 1; i < sortedLogs.length; i++) {
      const currentLog = sortedLogs[i]
      const prevLog = sortedLogs[i-1]
      
      if (currentLog && prevLog) {
        const daysBetween = (new Date(currentLog.createdAt).getTime() - 
                           new Date(prevLog.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        intervals.push(daysBetween)
      }
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    
    if (avgInterval < 30) return 'heavy'
    if (avgInterval < 60) return 'moderate'
    if (avgInterval < 90) return 'light'
    return 'minimal'
  }, [maintenanceLogs])

  // Score de saúde do veículo
  const healthScore = useMemo(() => {
    let score = 100
    
    // Penalidade por tempo sem manutenção
    const daysSinceLastMaintenance = maintenanceLogs.length > 0
      ? Math.floor((Date.now() - new Date(Math.max(...maintenanceLogs.map(log => new Date(log.createdAt).getTime()))).getTime()) / (1000 * 60 * 60 * 24))
      : 365
    
    if (daysSinceLastMaintenance > 90) score -= 30
    else if (daysSinceLastMaintenance > 60) score -= 15
    else if (daysSinceLastMaintenance > 30) score -= 5
    
    // Bônus por manutenções preventivas
    const preventiveCount = maintenanceLogs.filter(log => log.type === 'PREVENTIVE').length
    const preventiveRatio = maintenanceLogs.length > 0 ? preventiveCount / maintenanceLogs.length : 0
    score += preventiveRatio * 20
    
    // Penalidade por custos altos
    const avgCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost ?? 0), 0) / maintenanceLogs.length
    if (avgCost > 500) score -= 10
    else if (avgCost > 300) score -= 5
    
    return Math.max(0, Math.min(100, Math.round(score)))
  }, [maintenanceLogs])

  return useMemo(() => ({
    monthlySpending,
    projectedCosts,
    usagePattern,
    healthScore
  }), [
    monthlySpending,
    projectedCosts,
    usagePattern,
    healthScore,
    vehicle
  ])
}

// Hook para memoizar cache de dados
export function useDataCache<T>(key: string, fetcher: () => Promise<T>, ttl: number = 5 * 60 * 1000) {
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map())

  const getCachedData = useCallback(async (): Promise<T> => {
    const cached = cache.current.get(key)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < ttl) {
      return cached.data
    }

    const data = await fetcher()
    cache.current.set(key, { data, timestamp: now })
    return data
  }, [key, fetcher, ttl])

  const invalidateCache = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      cache.current.delete(cacheKey)
    } else {
      cache.current.clear()
    }
  }, [])

  return {
    getCachedData,
    invalidateCache
  }
}
