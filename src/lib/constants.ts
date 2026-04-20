import { PredictiveRule, MaintenanceType } from "@/types"
import { Bike, Search, Settings, Wrench, LucideIcon } from "lucide-react"

// Navigation tabs for MobileNav
export interface NavTab {
  name: string
  href: string
  icon: LucideIcon
}

export const MOBILE_NAV_TABS: NavTab[] = [
  { name: "Início", href: "/", icon: Bike },
  { name: "Busca", href: "/search", icon: Search },
  { name: "Peças", href: "/parts", icon: Wrench },
  { name: "Ajustes", href: "/settings", icon: Settings },
]

// Predictive maintenance rules based on keywords and lifespan in KM
export const PREDICTIVE_RULES: PredictiveRule[] = [
  { keyword: "óleo", lifespan: 5000, name: "Troca de Óleo" },
  { keyword: "oleo", lifespan: 5000, name: "Troca de Óleo" },
  { keyword: "pastilha", lifespan: 10000, name: "Pastilhas de Freio" },
  { keyword: "fluido", lifespan: 12000, name: "Fluido de Freio/Arrefecimento" },
  { keyword: "vela", lifespan: 12000, name: "Velas de Ignição" }
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
