"use client"

import { useOffline } from "@/hooks/use-offline"
import { WifiOff, Wifi } from "lucide-react"
import { useEffect, useState } from "react"

export function OfflineIndicator() {
  const { isOffline, wasOffline } = useOffline()
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isOffline && wasOffline) {
      setShowReconnected(true)
      timer = setTimeout(() => setShowReconnected(false), 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isOffline, wasOffline])

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-2 text-center font-bold uppercase tracking-widest text-sm">
        <WifiOff className="h-4 w-4 inline mr-2" />
        Sem conexão com a internet
      </div>
    )
  }

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-2 text-center font-bold uppercase tracking-widest text-sm animate-out fade-out slide-out-to-top duration-500">
        <Wifi className="h-4 w-4 inline mr-2" />
        Conexão restaurada
      </div>
    )
  }

  return null
}
