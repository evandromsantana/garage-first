"use client"

import { useCallback } from "react"
import { toast } from "sonner"

interface ShareData {
  title: string
  text: string
  url: string
}

interface UseShareReturn {
  canShare: boolean
  share: (data: ShareData) => Promise<void>
}

export function useShare(): UseShareReturn {
  const canShare = typeof navigator !== "undefined" && !!navigator.share

  const share = useCallback(async (data: ShareData) => {
    if (!canShare) {
      toast.info("Compartilhamento nativo não suportado neste navegador")
      return
    }

    try {
      await navigator.share(data)
    } catch {
      // User cancelled or share failed silently
      console.log("Compartilhamento abortado ou falhou")
    }
  }, [canShare])

  return { canShare, share }
}

export function usePrint(): () => void {
  return useCallback(() => {
    window.print()
  }, [])
}
