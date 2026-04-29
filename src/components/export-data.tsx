"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { exportToJSON, exportToCSV, downloadFile, generateMaintenanceReport } from "@/lib/export"
import { VehicleSummary, MaintenanceLog } from "@/types"
import { toast } from "sonner"

interface ExportDataProps {
  vehicle: VehicleSummary
  maintenanceLogs: MaintenanceLog[]
}

export function ExportData({ vehicle, maintenanceLogs }: ExportDataProps) {
  const handleExportJSON = () => {
    const data = {
      vehicle,
      maintenanceLogs,
      generatedAt: new Date().toISOString(),
      version: "1.0.0",
    }
    const json = exportToJSON(data)
    downloadFile(json, `garage-ninja-backup-${new Date().toISOString().split("T")[0]}.json`, "application/json")
    toast.success("Backup JSON exportado!")
  }

  const handleExportCSV = () => {
    const csv = exportToCSV(maintenanceLogs)
    downloadFile(csv, `garage-ninja-historico-${new Date().toISOString().split("T")[0]}.csv`, "text/csv")
    toast.success("Histórico CSV exportado!")
  }

  const handleExportReport = () => {
    const report = generateMaintenanceReport(vehicle, maintenanceLogs)
    downloadFile(report, `garage-ninja-relatorio-${new Date().toISOString().split("T")[0]}.txt`, "text/plain")
    toast.success("Relatório de manutenção exportado!")
  }

  return (
    <div className="space-y-3">
      <h3 className="font-black uppercase tracking-widest text-sm">Exportar Dados</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          onClick={handleExportJSON}
          className="h-12 font-bold uppercase tracking-wider border-2 border-foreground rounded-none justify-start"
          aria-label="Exportar backup em formato JSON"
        >
          <Download className="h-4 w-4 mr-3" />
          Backup Completo (JSON)
        </Button>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="h-12 font-bold uppercase tracking-wider border-2 border-foreground rounded-none justify-start"
          aria-label="Exportar histórico em formato CSV"
        >
          <FileSpreadsheet className="h-4 w-4 mr-3" />
          Histórico (CSV)
        </Button>
        <Button
          variant="outline"
          onClick={handleExportReport}
          className="h-12 font-bold uppercase tracking-wider border-2 border-foreground rounded-none justify-start"
          aria-label="Exportar relatório de manutenção"
        >
          <FileText className="h-4 w-4 mr-3" />
          Relatório de Manutenção
        </Button>
      </div>
    </div>
  )
}
