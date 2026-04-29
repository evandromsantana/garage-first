import { getVehicleWithData, getFirstVehicle } from "@/app/actions"
import { requireAuth } from "@/lib/auth-server"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Award, Wrench, Calendar, Settings, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { PrintButton } from "@/components/print-button"

export default async function PassportPage() {
  const user = await requireAuth()
  const baseVehicle = await getFirstVehicle(user.id)
  if (!baseVehicle) {
    return <div className="p-4 font-mono">Veículo base não encontrado. Rode a home antes.</div>
  }

  const vehicle = await getVehicleWithData(baseVehicle.id)

  if (!vehicle) {
    return <div className="p-4 font-mono">Veículo não encontrado no banco de dados.</div>
  }

  // Calculate metrics
  const totalLogs = vehicle.maintenanceLogs.length
  const preventiveCount = vehicle.maintenanceLogs.filter(log => log.type === 'PREVENTIVE').length
  const preventivePercentage = totalLogs > 0 ? Math.round((preventiveCount / totalLogs) * 100) : 0
  
  const allExpenses = vehicle.maintenanceLogs.flatMap(log => log.expenses)
  const oemCount = allExpenses.filter(e => e.isOem).length
  const totalParts = Object.keys(allExpenses).length
  const oemPercentage = totalParts > 0 ? Math.round((oemCount / totalParts) * 100) : 0

  return (
    <div className="min-h-screen bg-background font-mono pb-20">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="p-2 rounded-none hover:bg-foreground hover:text-background border-2 border-transparent transition-none">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-black uppercase tracking-wider">Passaporte Mecânico</h1>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-8 bg-white text-black min-h-screen print:p-0 print:border-none border-x-4 border-foreground">
        {/* Certificate Header */}
        <div className="text-center space-y-4 border-4 border-black p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="h-48 w-48" />
          </div>
          
          <Badge variant="outline" className="text-lg px-6 py-2 border-4 border-black font-black uppercase text-black bg-white rounded-none">
            Certificado de Procedência
          </Badge>
          
          <h2 className="text-4xl font-black uppercase tracking-tighter pt-4">
            {vehicle.model}
          </h2>
          <p className="text-xl font-bold font-mono tracking-widest border-t-2 border-dashed border-black/30 pt-4">
            ANO {vehicle.year} • ODÔMETRO: {vehicle.currentKm.toLocaleString()} KM
          </p>
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-4 border-black p-4 flex flex-col items-center justify-center text-center">
            <Award className="h-10 w-10 mb-2" />
            <p className="text-5xl font-black">{oemPercentage}%</p>
            <p className="text-xs font-bold uppercase tracking-widest mt-2 border-t-2 border-black w-full pt-1">Peças OEM</p>
          </div>
          <div className="border-4 border-black p-4 flex flex-col items-center justify-center text-center">
            <Settings className="h-10 w-10 mb-2" />
            <p className="text-5xl font-black">{preventivePercentage}%</p>
            <p className="text-xs font-bold uppercase tracking-widest mt-2 border-t-2 border-black w-full pt-1">Preventivas</p>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-2 flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Histórico Oficial
          </h3>
          
          <div className="space-y-4">
            {vehicle.maintenanceLogs.map((log) => (
              <div key={log.id} className="border-l-4 border-black pl-4 py-1 relative">
                <div className="absolute -left-[14px] top-2 h-5 w-5 bg-black" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black uppercase text-lg">{log.description}</p>
                    <div className="flex items-center gap-4 text-sm font-bold uppercase mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>KM: {log.kmAtService.toLocaleString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-2 border-black rounded-none font-black text-black">
                    {log.type}
                  </Badge>
                </div>
                
                {log.expenses.length > 0 && (
                  <div className="mt-3 bg-gray-100 p-3 border-2 border-black/20">
                    <p className="text-xs font-black uppercase mb-2">Peças Trocadas:</p>
                    <ul className="space-y-1">
                      {log.expenses.map(exp => (
                        <li key={exp.id} className="text-sm font-bold flex justify-between uppercase">
                          <span>- {exp.itemName}</span>
                          {exp.isOem ? (
                            <span className="px-2 bg-black text-white text-[10px]">OEM</span>
                          ) : (
                            <span className="text-gray-500 text-[10px] border border-gray-400 px-1">AFTER</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Print Footer */}
        <div className="pt-8 border-t-4 border-black text-center print:block hidden">
          <p className="font-bold uppercase text-sm">Gerado automaticamente por Garage Ninja</p>
          <p className="text-xs uppercase text-gray-500 mt-1">Autenticidade mecânica comprovada por dados táticos.</p>
        </div>

        {/* Print Button (Hidden in print) */}
        <div className="pt-8 print:hidden flex justify-center">
          <PrintButton />
        </div>
      </main>
    </div>
  )
}
