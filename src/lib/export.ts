import { VehicleSummary, MaintenanceLog } from "@/types"

interface ExportData {
  vehicle: VehicleSummary
  maintenanceLogs: MaintenanceLog[]
  generatedAt: string
  version: string
}

export function exportToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2)
}

export function exportToCSV(maintenanceLogs: MaintenanceLog[]): string {
  const headers = [
    "Data",
    "Tipo",
    "Descrição",
    "KM",
    "Custo",
    "Status",
    "Peças (detalhes)",
  ]

  const rows = maintenanceLogs.map((log) => [
    new Date(log.createdAt).toLocaleDateString("pt-BR"),
    log.type,
    log.description,
    log.kmAtService,
    log.cost ?? 0,
    log.status,
    log.expenses
      .map((e) => `${e.itemName} (R$${e.itemCost})`)
      .join("; "),
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateMaintenanceReport(
  vehicle: VehicleSummary,
  logs: MaintenanceLog[]
): string {
  const totalSpent = logs.reduce(
    (sum, log) => sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0),
    0
  )

  const partsUsed = logs.flatMap((l) => l.expenses)
  const originalParts = partsUsed.filter((p) => p.isOriginalPart).length
  const aftermarketParts = partsUsed.filter((p) => !p.isOriginalPart).length

  return `
RELATÓRIO DE MANUTENÇÃO
========================

Veículo: ${vehicle.model}
Quilometragem Atual: ${vehicle.currentKm.toLocaleString()} km
Total Gasto: R$ ${totalSpent.toLocaleString("pt-BR")}

RESUMO DE SERVIÇOS
------------------
Total de Manutenções: ${logs.length}
Peças OEM: ${originalParts}
Peças Aftermarket: ${aftermarketParts}

HISTÓRICO DETALHADO
-------------------
${logs
  .map(
    (log) => `
[${new Date(log.createdAt).toLocaleDateString("pt-BR")}] ${log.type}
${log.description}
KM: ${log.kmAtService.toLocaleString()} | Custo: R$ ${(
      (log.cost ?? 0) +
      log.expenses.reduce((s, e) => s + e.itemCost, 0)
    ).toLocaleString("pt-BR")}
Peças: ${log.expenses.map((e) => e.itemName).join(", ") || "Nenhuma"}
`
  )
  .join("\n")}

Gerado em: ${new Date().toLocaleString("pt-BR")}
Garage Ninja - Sistema de Gestão de Manutenção
`
}
