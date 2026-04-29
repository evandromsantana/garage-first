import { MaintenanceType } from "@/types"
import { Bike, Search, Settings, Wrench, LucideIcon } from "lucide-react"

// Navigation tabs for MobileNav
export interface NavTab {
  name: string
  href: string
  icon: LucideIcon
  label: string
}

export const MOBILE_NAV_TABS: NavTab[] = [
  { name: "Início", href: "/", icon: Bike, label: "Ir para página inicial" },
  { name: "Busca", href: "/search", icon: Search, label: "Buscar informações técnicas" },
  { name: "Peças", href: "/parts", icon: Wrench, label: "Ver inventário de peças" },
  { name: "Ajustes", href: "/settings", icon: Settings, label: "Configurações do aplicativo" },
]


// Alert threshold in KM (show alert when remaining KM is less than this)
export const ALERT_THRESHOLD_KM = 500

// Map maintenance names to types
export const MAINTENANCE_TYPE_MAP: Record<string, MaintenanceType> = {
  "Troca de Óleo": "PREVENTIVE",
  "Revisão Preventiva": "PREVENTIVE",
  "Ajuste Corretivo": "CORRECTIVE",
  "Upgrade": "UPGRADE",
}

// Default quick log actions
export const QUICK_LOG_ACTIONS = [
  "Troca de Óleo",
  "Revisão Preventiva",
  "Ajuste Corretivo",
  "Upgrade"
] as const

// Maintenance type labels
export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  UPGRADE: "Upgrade"
}

// Maintenance type colors for UI
export const MAINTENANCE_TYPE_STYLES: Record<MaintenanceType, { bg: string; text: string; border: string }> = {
  PREVENTIVE: { bg: "bg-background", text: "text-foreground", border: "border-foreground" },
  CORRECTIVE: { bg: "bg-foreground", text: "text-background", border: "border-foreground" },
  UPGRADE: { bg: "bg-muted", text: "text-foreground", border: "border-foreground border-dashed" }
}
