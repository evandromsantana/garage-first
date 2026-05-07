"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SmartAlert } from "@/types"
import { Bell, Bike, Settings } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  vehicleName: string
  alerts: SmartAlert[]
  unreadCount: number
  criticalCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAlerts: () => void
}

export function DashboardHeader({ 
  vehicleName, 
  alerts, 
  unreadCount, 
  criticalCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAlerts
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background px-4 py-4 border-b-8 border-double border-foreground">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">NINJA</h1>
            <div className="bg-foreground text-background px-2 py-1 flex items-center justify-center">
              <Bike className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            {vehicleName} • REGISTRO DE PROCEDÊNCIA
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications / Alerts */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-12 w-12 border-4 border-foreground rounded-none p-0 hover:bg-foreground hover:text-background transition-none flex items-center justify-center bg-background text-foreground">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-black border-2 border-foreground rounded-full ${criticalCount > 0 ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}>
                  {unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 border-4 border-foreground rounded-none p-0 bg-background">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-4 border-b-4 border-foreground flex justify-between items-center bg-muted/20">
                  <h3 className="font-black uppercase tracking-widest text-xs">Alertas de Sistema</h3>
                  <Button variant="link" onClick={onMarkAllAsRead} className="text-[10px] font-black uppercase p-0 h-auto">Lidos</Button>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <div className="max-h-64 overflow-auto divide-y-2 divide-foreground/10">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-[10px] font-bold uppercase opacity-30">Nenhum alerta ativo</div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 space-y-1 ${alert.isRead ? 'opacity-40' : ''}`}>
                      <p className="text-[10px] font-black uppercase tracking-wider">{alert.title}</p>
                      <p className="text-xs font-bold leading-tight">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
              {alerts.length > 0 && (
                <div className="p-2 border-t-2 border-foreground/10">
                  <Button variant="ghost" onClick={onClearAlerts} className="w-full text-[10px] font-black uppercase h-8">Limpar Todos</Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/settings">
            <Button variant="ghost" className="h-12 w-12 border-4 border-foreground rounded-none p-0 hover:bg-foreground hover:text-background transition-none">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
