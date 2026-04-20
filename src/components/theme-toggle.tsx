"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <Button
      variant="outline"
      onClick={toggle}
      className={`w-full h-16 text-lg font-black uppercase tracking-widest border-4 border-foreground rounded-none shadow-[4px_4px_0_0_colord(var(--foreground))] hover:scale-[0.98] transition-transform flex items-center justify-center gap-3 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
    >
      {isDark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      {isDark ? "TEMA ESCURO ATIVO" : "TEMA CLARO ATIVO"}
    </Button>
  )
}
