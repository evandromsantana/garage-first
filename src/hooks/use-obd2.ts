"use client"

import { useState, useCallback, useRef } from 'react'

export interface OBDDataPoint {
  rpm: number
  speed: number
  temp: number
  engineLoad: number
  timestamp: number
}

interface OBDState {
  current: OBDDataPoint
  history: OBDDataPoint[]
  connected: boolean
}

// GATT Service and Characteristic for standard ELM327 BLE
const OBD_SERVICE = '0000fff0-0000-1000-8000-00805f9b34fb'

export function useOBD2() {
  const [state, setState] = useState<OBDState>(() => ({
    current: {
      rpm: 0,
      speed: 0,
      temp: 0,
      engineLoad: 0,
      timestamp: Date.now()
    },
    history: [],
    connected: false,
  }))
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError("Web Bluetooth API não suportada neste navegador. Use Chrome ou Edge no PC/Android.")
      return
    }

    try {
      setError(null)
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [OBD_SERVICE]
      })

      device.addEventListener('gattserverdisconnected', () => {
        setState(prev => ({ ...prev, connected: false }))
        if (intervalRef.current) clearInterval(intervalRef.current)
      })

      const server = await device.gatt?.connect()
      if (!server) throw new Error("Falha ao conectar ao servidor GATT")

      setState(prev => ({ ...prev, connected: true }))

      // Inicia a comunicação real (Placeholder para comandos AT do ELM327)
      // No futuro, aqui enviaríamos comandos como '010C' para RPM via GATT
      toast.success("Adaptador Pareado! Aguardando fluxo telemétrico...")
      
      // Manteremos um listener de sinal para indicar que a conexão está viva
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          current: {
            ...prev.current,
            timestamp: Date.now()
          }
        }))
      }, 2000)

    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || "Erro ao conectar")
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      connected: false, 
      current: { ...prev.current, rpm: 0, speed: 0 } 
    }))
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return {
    data: { ...state.current, connected: state.connected },
    history: state.history,
    error,
    connect,
    disconnect
  }
}
