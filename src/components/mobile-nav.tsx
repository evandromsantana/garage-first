"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MOBILE_NAV_TABS } from "@/lib/constants/navigation"

export function MobileNav() {
  const pathname = usePathname()

  // Não mostrar navbar em páginas de autenticação
  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t-[3px] border-foreground h-16 flex items-center justify-around px-1 font-mono">
      {MOBILE_NAV_TABS.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        
        return (
          <Link
            key={tab.name}
            href={tab.href}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-none
              ${isActive ? 'text-foreground font-black' : 'text-muted-foreground font-medium hover:text-foreground/70'}
            `}
          >
            <div className={`p-1 flex flex-col items-center justify-center ${isActive ? '' : ''}`}>
              <Icon className="h-5 w-5 mb-1" strokeWidth={isActive ? 3 : 2} aria-hidden="true" />
              <span className={`text-[10px] uppercase tracking-widest ${isActive ? 'border-b-2 border-foreground' : 'border-b-2 border-transparent'}`}>
                {tab.name}
              </span>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
