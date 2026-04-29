// Simple in-memory cache for client-side data
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheItem<unknown>>()

export function getCache<T>(key: string): T | null {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() - item.timestamp > item.ttl) {
    cache.delete(key)
    return null
  }

  return item.data as T
}

export function setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear()
    return
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// Cache keys
export const CACHE_KEYS = {
  VEHICLE_DATA: "vehicle_data",
  MAINTENANCE_LOGS: "maintenance_logs",
  TECHNICAL_DATA: "technical_data",
  PENDING_TASKS: "pending_tasks",
} as const

// Default TTL values (in milliseconds)
export const CACHE_TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
} as const
