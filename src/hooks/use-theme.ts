"use client"

import { useEffect, useState, useCallback } from "react"

const THEME_KEY = "theme"
const DARK_CLASS = "dark"

type Theme = "light" | "dark"

interface UseThemeReturn {
  theme: Theme
  isDark: boolean
  toggle: () => void
  setTheme: (theme: Theme) => void
}

function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return

  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add(DARK_CLASS)
  } else {
    root.classList.remove(DARK_CLASS)
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return (localStorage.getItem(THEME_KEY) as Theme) || "light"
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  // Mark as mounted after initial render (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
  }, [])

  const toggle = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
  }, [theme, setTheme])

  // Prevent hydration mismatch by returning light during SSR
  const currentTheme = mounted ? theme : "light"

  return {
    theme: currentTheme,
    isDark: currentTheme === "dark",
    toggle,
    setTheme,
  }
}
