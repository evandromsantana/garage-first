"use client"

import { useState, useEffect, useCallback } from "react"

function getInitialOfflineState(): boolean {
  if (typeof navigator === "undefined") return false
  return !navigator.onLine
}

interface UseOfflineReturn {
  isOffline: boolean
  wasOffline: boolean
  checkConnection: () => boolean
}

export function useOffline(): UseOfflineReturn {
  const [isOffline, setIsOffline] = useState<boolean>(getInitialOfflineState)
  const [wasOffline, setWasOffline] = useState(false)

  const checkConnection = useCallback((): boolean => {
    if (typeof navigator === "undefined") return true

    const online = navigator.onLine
    setIsOffline(!online)
    if (!online) setWasOffline(true)
    return online
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => {
      setIsOffline(false)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setWasOffline(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return {
    isOffline,
    wasOffline,
    checkConnection,
  }
}
