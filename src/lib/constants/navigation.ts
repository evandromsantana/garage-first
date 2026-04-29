import { Bike, Search, Settings, Wrench, LucideIcon } from "lucide-react"

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
