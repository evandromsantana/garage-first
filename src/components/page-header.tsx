"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ReactNode } from "react"

import { haptics } from "@/lib/haptics"

interface PageHeaderProps {
  title: string
  icon?: ReactNode
  backHref?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  icon,
  backHref = "/",
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4 shadow-[0_4px_0_0_var(--foreground)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            onClick={() => haptics.light()}
            className="p-2 border-4 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[2px_2px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="h-6 w-6 font-black" />
          </Link>
          {icon && <div className="text-foreground">{icon}</div>}
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            {title}
          </h1>
        </div>
        {children}
      </div>
    </header>
  )
}
