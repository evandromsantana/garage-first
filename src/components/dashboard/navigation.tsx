"use client"

import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import Link from "next/link"

export function DashboardNavigation() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/analytics">
        <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-foreground hover:text-background rounded-none transition-none">
          <span className="text-xs">Analytics</span>
        </Button>
      </Link>
      <Link href="/technical">
        <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-foreground hover:text-background rounded-none transition-none">
          <span className="text-xs">Technical</span>
        </Button>
      </Link>
      <Link href="/search">
        <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-foreground hover:text-background rounded-none transition-none">
          <span className="text-xs">Search</span>
        </Button>
      </Link>
      <Link href="/agents">
        <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-foreground hover:text-background rounded-none transition-none">
          <span className="text-xs">Agentes</span>
        </Button>
      </Link>
      <DarkModeToggle />
    </div>
  )
}
