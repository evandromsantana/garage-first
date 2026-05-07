"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wrench, BarChart2, Settings, BookOpen } from "lucide-react"
import { useGloveMode } from "@/contexts/glove-mode"
import { haptics } from "@/lib/haptics"

export function MobileNav() {
  const pathname = usePathname()
  const { isGloveMode, toggleGloveMode } = useGloveMode()

  if (pathname.startsWith('/auth')) {
    return null
  }

  const navItems = [
    { name: "Painel", href: "/dashboard", icon: Home },
    { name: "Oficina", href: "/maintenance", icon: Wrench },
    { name: "Técnico", href: "/technical", icon: BookOpen },
    { name: "Análise", href: "/analytics", icon: BarChart2 },
  ]

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t-4 border-foreground h-20 flex items-center justify-between px-0 font-mono shadow-[0_-8px_0_0_rgba(0,0,0,0.05)] pb-safe transition-all duration-300 ${isGloveMode ? 'h-24' : 'h-20'}`}>
      <div className="flex-1 flex h-full">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) || (item.href === "/dashboard" && pathname === "/")
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-none relative
                ${isActive ? 'bg-foreground text-background' : 'text-foreground hover:bg-foreground/5'}
              `}
              onClick={() => haptics.light()}
            >
              <Icon className={`${isGloveMode ? 'h-8 w-8' : 'h-6 w-6'} mb-1`} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[8px] uppercase font-black tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>

      {/* TACTICAL GLOVE TOGGLE */}
      <button
        onClick={() => { haptics.heavy(); toggleGloveMode(); }}
        className={`w-20 h-full flex flex-col items-center justify-center border-l-4 border-foreground transition-all
          ${isGloveMode ? 'bg-foreground text-background' : 'bg-muted/20 text-foreground'}
        `}
      >
        <div className={`p-1 border-2 border-current rounded-none mb-1 ${isGloveMode ? 'animate-pulse' : ''}`}>
           <span className="text-[10px] font-black italic leading-none">LUVA</span>
        </div>
        <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">
          {isGloveMode ? 'ATIVADO' : 'DESATIVADO'}
        </span>
      </button>
    </nav>
  )
}
