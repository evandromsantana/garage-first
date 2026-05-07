"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface GloveModeContextType {
  isGloveMode: boolean
  toggleGloveMode: () => void
}

const GloveModeContext = createContext<GloveModeContextType | undefined>(undefined)

export function GloveModeProvider({ children }: { children: React.ReactNode }) {
  const [isGloveMode, setIsGloveMode] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('glove-mode')
    if (saved === 'true') {
      setIsGloveMode(true)
    }
  }, [])

  // Sync with document body class and localStorage
  useEffect(() => {
    if (isGloveMode) {
      document.documentElement.classList.add('glove-mode')
      localStorage.setItem('glove-mode', 'true')
    } else {
      document.documentElement.classList.remove('glove-mode')
      localStorage.setItem('glove-mode', 'false')
    }
  }, [isGloveMode])

  const toggleGloveMode = () => {
    setIsGloveMode(prev => !prev)
  }

  return (
    <GloveModeContext.Provider value={{ isGloveMode, toggleGloveMode }}>
      {children}
    </GloveModeContext.Provider>
  )
}

export function useGloveMode() {
  const context = useContext(GloveModeContext)
  if (context === undefined) {
    throw new Error('useGloveMode must be used within a GloveModeProvider')
  }
  return context
}
