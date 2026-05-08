import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, FileText, Bot, Cloud, AlertTriangle, LogOut } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { getVehicleWithData, loadOrCreateVehicle, getTechnicalSpecs, logout } from "@/app/actions"
import { getMaintenanceRules } from "@/app/actions/maintenance-rules"
import { ExportData } from "@/components/export-data"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppPreferences } from "./app-preferences"
import { VehicleSettingsForm } from "@/components/settings/vehicle-settings-form"
import { TechnicalSpecsManager } from "@/components/settings/technical-specs-manager"
import { MaintenanceRulesManager } from "@/components/settings/maintenance-rules-manager"

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value
  
  if (!authToken) redirect('/auth/login')
  
  const user = verifyToken(authToken)
  if (!user) redirect('/auth/login')
  
  const vehicleBase = await loadOrCreateVehicle()
  const vehicle = await getVehicleWithData(vehicleBase.id)
  const specs = await getTechnicalSpecs(vehicleBase.id)
  const rules = await getMaintenanceRules(vehicleBase.id)

  if (!vehicle) return <div>Veículo não encontrado</div>

  return (
    <div className="kindle-page">
      <PageHeader title="TERMINAL DE CONFIGURAÇÃO" icon={<Settings className="h-6 w-6" />} backHref="/" />

      <main className="space-y-8 pt-6 max-w-2xl mx-auto pb-20">
        
        {/* Vehicle Identity Section */}
        <VehicleSettingsForm vehicle={vehicle} />

        {/* System Warnings */}
        <div className="kindle-card border-dashed bg-muted/10 p-5 flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Nota: A quilometragem informada afeta todos os cálculos de IA e previsões de manutenção futura.
          </p>
        </div>

        {/* Global Actions */}
        <div className="space-y-4 pt-4">
          <Link href="/passport" className="block">
            <Button variant="outline" className="kindle-button w-full h-20 bg-foreground text-background hover:bg-background hover:text-foreground">
              <FileText className="h-8 w-8 mr-4" />
              EMITIR PASSAPORTE TÉCNICO
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/agents">
              <Button variant="outline" className="kindle-button w-full h-16 border-4 border-foreground text-[10px] sm:text-xs">
                <Bot className="h-6 w-6 mr-2" />
                CENTRAL AGENTES IA
              </Button>
            </Link>
            <Link href="/backup">
              <Button variant="outline" className="kindle-button w-full h-16 border-4 border-foreground text-[10px] sm:text-xs">
                <Cloud className="h-6 w-6 mr-2" />
                SERVIDOR BACKUP
              </Button>
            </Link>
          </div>
          
          <AppPreferences />
        </div>

        {/* Technical Specs Section */}
        <section className="space-y-4 pt-4">
          <TechnicalSpecsManager vehicleId={vehicle.id} initialSpecs={specs} />
        </section>

        {/* Maintenance Rules Section */}
        <section className="space-y-4 pt-4">
          <MaintenanceRulesManager vehicleId={vehicle.id} initialRules={rules} />
        </section>

        {/* Export Section */}
        <section className="space-y-4 pt-4">
           <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest">Backup & Dados</h3>
          </div>
          <Card className="kindle-card">
            <CardContent className="p-6">
              <ExportData
                vehicle={vehicle}
                maintenanceLogs={vehicle.maintenanceLogs}
              />
            </CardContent>
          </Card>
        </section>
        {/* Conta & Sair */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-destructive">Gerenciamento de Conta</h3>
          </div>
          <Card className="kindle-card border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Encerrar Sessão</p>
                  <p className="text-xs text-muted-foreground">Sair com segurança desta conta neste dispositivo.</p>
                </div>
                <form action={logout}>
                  <Button 
                    variant="destructive" 
                    className="h-12 px-6 border-4 border-destructive bg-background text-destructive hover:bg-destructive hover:text-background transition-none font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </section>


        {/* Ownership Summary */}
        <div className="kindle-card bg-foreground text-background">
          <CardContent className="p-8 text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">ÍNDICE DE PROCEDÊNCIA MECÂNICA</p>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">ESTADO GERAL</h3>
            <div className="pt-4 border-t-2 border-background/20 mt-4">
              <p className="text-2xl font-black uppercase">EXCELENTE</p>
              <p className="text-[9px] font-black uppercase opacity-40 tracking-[0.2em]">AUDITORIA DE DADOS IA CONCLUÍDA</p>
            </div>
          </CardContent>
        </div>
      </main>
    </div>
  )
}
