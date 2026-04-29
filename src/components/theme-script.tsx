"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // Remove dark class and theme from localStorage on first load
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme')
  }, [])

  return null
}
