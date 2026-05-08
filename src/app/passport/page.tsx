import { getVehicleWithData } from "@/app/actions"
export const unstable_instant = false

import { PageHeader } from "@/components/page-header"
import { PrintButton } from "@/components/print-button"
import { formatCurrency } from "@/lib"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/db"
import { Award } from "lucide-react"
import { CertificateHeader } from "@/components/passport/certificate-header"
import { MaintenanceTimeline } from "@/components/passport/maintenance-timeline"

export default async function PassportPage() {
  const user = await requireAuth()
  const vehicleBase = await prisma.vehicle.findFirst({ where: { userId: user.id } })
  
  if (!vehicleBase) return <div>Veículo não encontrado</div>
  
  const vehicle = await getVehicleWithData(vehicleBase.id)
  
  if (!vehicle) return <div>Falha ao carregar dados do veículo</div>
 
  const totalInvested = vehicle.maintenanceLogs.reduce((acc, log) => {
    const partsSum = log.expenses.reduce((eAcc, exp) => eAcc + exp.itemCost, 0)
    return acc + (log.cost || 0) + partsSum
  }, 0)

  return (
    <div className="kindle-page bg-zinc-50 min-h-screen pb-20">
      <PageHeader 
        title="PASSAPORTE DE PROCEDÊNCIA" 
        icon={<Award className="h-6 w-6" />}
        backHref="/dashboard"
      />

      <main className="p-4 space-y-8 max-w-2xl mx-auto">
        {/* Certificate Header Section */}
        <CertificateHeader 
          ownerName={vehicle.ownerName}
          brand={vehicle.brand}
          model={vehicle.model}
          plate={vehicle.plate}
          uf={vehicle.uf}
          year={vehicle.year}
          color={vehicle.color}
          renavam={vehicle.renavam}
          chassis={vehicle.chassis}
          engineNumber={vehicle.engineNumber}
          vehicleId={vehicle.id}
        />

        {/* Executive Summary */}
        <div className="grid grid-cols-2 gap-4">
           <div className="kindle-card bg-foreground text-background p-4 space-y-1 animate-in slide-in-from-left-4 duration-500">
              <p className="text-[9px] font-black opacity-60 uppercase">TOTAL INVESTIDO</p>
              <p className="text-xl font-black">{formatCurrency(totalInvested)}</p>
           </div>
           <div className="kindle-card p-4 space-y-1 animate-in slide-in-from-right-4 duration-500">
              <p className="text-[9px] font-black opacity-40 uppercase">STATUS ATUAL</p>
              <p className="text-xl font-black text-green-600 uppercase italic">OPERACIONAL</p>
           </div>
        </div>

        {/* Timeline Section */}
        <MaintenanceTimeline logs={vehicle.maintenanceLogs} />

        {/* Authenticity Footer */}
        <div className="border-4 border-dashed border-foreground/20 p-6 text-center space-y-3 bg-zinc-100">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">ASSINATURA DIGITAL DE INTEGRIDADE</p>
           <div className="h-12 flex justify-center opacity-20">
              <div className="w-48 border-b-2 border-foreground" />
           </div>
           <p className="text-[8px] font-bold text-muted-foreground uppercase leading-tight">
             Este documento é um registro gerado pelo Garage Ninja com base nas inserções manuais e telemétricas do proprietário. Verifique sempre as notas fiscais físicas para autenticidade total.
           </p>
        </div>

        {/* Print Action - Only visible in UI */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 print:hidden">
           <PrintButton />
        </div>
      </main>
    </div>
  )
}
