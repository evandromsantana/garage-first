import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Cloud, Download, Upload, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { loadOrCreateVehicle, getVehicleWithData } from "@/app/actions"
import { requireAuth } from "@/lib/auth-server"

export default async function BackupPage() {
  await requireAuth()
  const vehicleBase = await loadOrCreateVehicle()
  const vehicle = await getVehicleWithData(vehicleBase.id)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="font-bold text-muted-foreground">Veículo não encontrado</p>
      </div>
    )
  }

  // Create backup data
  const backupData = {
    vehicle: {
      id: vehicle.id,
      model: vehicle.model,
      year: vehicle.year,
      currentKm: vehicle.currentKm,
      createdAt: vehicle.createdAt
    },
    maintenanceLogs: vehicle.maintenanceLogs,
    exportDate: new Date().toISOString(),
    version: "1.0"
  }

  const backupJson = JSON.stringify(backupData, null, 2)
  const backupBlob = new Blob([backupJson], { type: "application/json" })
  const backupUrl = URL.createObjectURL(backupBlob)

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-4 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] active:translate-y-1 active:shadow-none">
            <ArrowLeft className="h-6 w-6 font-black" />
          </Link>
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Backup & Restore</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Backup Status */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
              <Shield className="h-5 w-5" />
              Status do Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted border-2 border-dashed border-foreground rounded">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-black">{vehicle.maintenanceLogs.length}</p>
                <p className="text-xs font-bold uppercase text-muted-foreground">Registros</p>
              </div>
              <div className="text-center p-4 bg-muted border-2 border-dashed border-foreground rounded">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-black">{vehicle.currentKm.toLocaleString()}</p>
                <p className="text-xs font-bold uppercase text-muted-foreground">KM Atual</p>
              </div>
              <div className="text-center p-4 bg-muted border-2 border-dashed border-foreground rounded">
                <Cloud className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-black">{Math.round(backupJson.length / 1024)}KB</p>
                <p className="text-xs font-bold uppercase text-muted-foreground">Tamanho</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-600 rounded">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold uppercase">Dados Prontos para Backup</span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Todos os seus dados estão sincronizados e prontos para exportação
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
              <Download className="h-5 w-5" />
              Exportar Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border-2 border-foreground/20 rounded">
                <div>
                  <p className="font-bold uppercase">Backup Completo</p>
                  <p className="text-xs text-muted-foreground">Todos os registros e configurações</p>
                </div>
                <a
                  href={backupUrl}
                  download={`garage-ninja-backup-${vehicle.model}-${vehicle.year}-${new Date().toISOString().split('T')[0]}.json`}
                  className="inline-flex"
                >
                  <Button className="h-12 px-6 border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-none font-black uppercase">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </a>
              </div>

              <div className="flex justify-between items-center p-3 border-2 border-dashed border-foreground/30 rounded opacity-60">
                <div>
                  <p className="font-bold uppercase">Backup na Nuvem</p>
                  <p className="text-xs text-muted-foreground">Em breve - Google Drive, Dropbox</p>
                </div>
                <Button disabled className="h-12 px-6 border-2 border-muted bg-muted text-muted-foreground rounded-none font-black uppercase">
                  <Cloud className="h-4 w-4 mr-2" />
                  Em breve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Options */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
              <Upload className="h-5 w-5" />
              Restaurar Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="p-4 bg-orange-50 border-2 border-orange-600 rounded">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-bold uppercase">Atenção</span>
              </div>
              <p className="text-sm text-orange-700 mt-2">
                Restaurar dados substituirá todos os registros atuais. Faça um backup antes de prosseguir.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border-2 border-dashed border-foreground/30 rounded opacity-60">
                <div>
                  <p className="font-bold uppercase">Importar Backup</p>
                  <p className="text-xs text-muted-foreground">Carregar arquivo .json de backup</p>
                </div>
                <Button disabled className="h-12 px-6 border-2 border-muted bg-muted text-muted-foreground rounded-none font-black uppercase">
                  <Upload className="h-4 w-4 mr-2" />
                  Em breve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup Schedule */}
        <Card className="bg-muted border-4 border-dashed border-foreground/50 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-8 w-8" />
              <div>
                <p className="font-bold uppercase text-sm">Backup Automático</p>
                <p className="text-xs uppercase">Configure backups automáticos semanais para nunca perder dados.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/analytics">
            <Button variant="outline" className="w-full h-16 text-lg font-black uppercase border-4 border-foreground rounded-none">
              Ver Analytics
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="w-full h-16 text-lg font-black uppercase border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_var(--foreground)] rounded-none hover:bg-foreground hover:text-background">
              Configurações
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
