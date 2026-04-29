import { PredictiveRule, MaintenanceType } from "@/types"

// Predictive maintenance rules based on keywords and lifespan in KM
export const PREDICTIVE_RULES: PredictiveRule[] = [
  { keyword: "óleo", lifespan: 5000, name: "Troca de Óleo", criticality: "high", category: "engine" },
  { keyword: "oleo", lifespan: 5000, name: "Troca de Óleo", criticality: "high", category: "engine" },
  { keyword: "corrente", lifespan: 8000, name: "Ajuste de Corrente", criticality: "medium", category: "general" },
  { keyword: "pastilha", lifespan: 10000, name: "Pastilhas de Freio", criticality: "high", category: "brakes" },
  { keyword: "freio", lifespan: 10000, name: "Sistema de Freio", criticality: "high", category: "brakes" },
  { keyword: "fluido", lifespan: 12000, name: "Fluido de Freio/Arrefecimento", criticality: "medium", category: "brakes" },
  { keyword: "vela", lifespan: 12000, name: "Velas de Ignição", criticality: "medium", category: "electronics" },
  { keyword: "pneu", lifespan: 15000, name: "Troca de Pneus", criticality: "high", category: "tires" },
  { keyword: "bateria", lifespan: 24000, name: "Bateria", criticality: "critical", category: "electronics" },
  { keyword: "filtro", lifespan: 5000, name: "Filtros", criticality: "medium", category: "engine" },
  { keyword: "embreagem", lifespan: 15000, name: "Embreagem", criticality: "high", category: "general" },
  { keyword: "suspensão", lifespan: 20000, name: "Suspensão", criticality: "medium", category: "general" },
  { keyword: "escape", lifespan: 25000, name: "Escapamento", criticality: "low", category: "engine" }
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

// Description suggestions by maintenance type
export const TYPE_SUGGESTIONS: Record<MaintenanceType, string[]> = {
  PREVENTIVE: [
    "Troca de Óleo e Filtro",
    "Revisão Preventiva",
    "Ajuste de Corrente",
    "Verificação de Freios"
  ],
  CORRECTIVE: [
    "Reparo no Sistema de Freios",
    "Ajuste de Embreagem",
    "Correção de Vazamento",
    "Substituição de Peça"
  ],
  UPGRADE: [
    "Instalação de Escapamento",
    "Upgrade de Suspensão",
    "Troca de Pneus",
    "Melhoria no Sistema de Freios"
  ]
}
