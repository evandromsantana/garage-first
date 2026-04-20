export interface Checklist {
  title: string
  items: string[]
}

export const MAINTENANCE_CHECKLISTS: Record<string, Checklist> = {
  PREVENTIVA: {
    title: "CHECKLIST PREVENTIVA",
    items: [
      "LIMPAR E LUBRIFICAR CORRENTE",
      "CALIBRAR PNEUS (D:28 / T:32)",
      "CHECAR NÍVEL DE ÓLEO",
      "CHECAR FLUIDO DE FREIO",
      "VERIFICAR LUZES / SETAS"
    ]
  },
  OLEO: {
    title: "TROCA DE ÓLEO (10W40)",
    items: [
      "AQUECER O MOTOR (3 MIN)",
      "DRENAR ÓLEO ANTIGO",
      "SUBSTITUIR FILTRO DE ÓLEO",
      "INSERIR 2.0L DE ÓLEO NOVO",
      "TORQUE NO BUJÃO (30 Nm) E FILTRO"
    ]
  },
  LAVAGEM: {
    title: "LAVAGEM TÁTICA",
    items: [
      "DESENGRAXAR RELAÇÃO E CORRENTE",
      "LAVAR CARENAGENS",
      "SECAR MOTO COMPLETAMENTE",
      "LUBRIFICAR CORRENTE (MOTUL C4)",
      "REVITALIZAR PLÁSTICOS NEGROS"
    ]
  }
}

export interface TorqueSpec {
  part: string
  value: string
}

export const TORQUE_SPECS: TorqueSpec[] = [
  { part: "Bujão de Óleo", value: "30 Nm" },
  { part: "Filtro de Óleo", value: "17 Nm" },
  { part: "Eixo Traseiro (Corrente)", value: "98 Nm" },
  { part: "Eixo Dianteiro", value: "64 Nm" },
  { part: "Pinça de Freio", value: "25 Nm" },
  { part: "Velas de Ignição", value: "13 Nm" },
]

export const QUICK_ACTIONS = [
  "Revisão Rápida",
  "Lavagem",
  "Lubrificação",
  "Ajuste de Corrente"
] as const

export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}
