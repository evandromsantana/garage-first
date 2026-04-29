import { getVehicleWithData } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Activity, DollarSign, Calendar, Award, Target, Zap } from "lucide-react"
import Link from "next/link"
import { loadOrCreateVehicle } from "@/app/actions/vehicle"
import { formatCurrency } from "@/lib"

export default async function AnalyticsPage() {
  const user = await requireAuth()
  const vehicleBase = await loadOrCreateVehicle()
  const vehicle = await getVehicleWithData(vehicleBase.id)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="font-bold text-muted-foreground">Veículo não encontrado</p>
      </div>
    )
  }

  // Calculate advanced metrics
  const totalSpent = vehicle.maintenanceLogs.reduce(
    (sum, log) => sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0),
    0
  )

  const avgCostPerMaintenance = vehicle.maintenanceLogs.length > 0 
    ? totalSpent / vehicle.maintenanceLogs.length 
    : 0

  const now = new Date()
  const monthlyAvg = vehicle.maintenanceLogs.length > 1
    ? totalSpent / ((now.getTime() - new Date(vehicle.maintenanceLogs[0].createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0

  const preventiveCount = vehicle.maintenanceLogs.filter(log => log.type === 'PREVENTIVE').length
  const preventivePercentage = vehicle.maintenanceLogs.length > 0 
    ? Math.round((preventiveCount / vehicle.maintenanceLogs.length) * 100) 
    : 0

  const allParts = vehicle.maintenanceLogs.flatMap(log => log.expenses)
  const oemParts = allParts.filter((part: any) => part.isOriginalPart).length
  const oemPercentage = allParts.length > 0 
    ? Math.round((oemParts / allParts.length) * 100) 
    : 0

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
  const recentLogs = vehicle.maintenanceLogs.filter(log => 
    new Date(log.createdAt).getTime() > thirtyDaysAgo.getTime()
  )
  const recentSpent = recentLogs.reduce((sum, log) => 
    sum + (log.cost ?? 0) + log.expenses.reduce((s, e) => s + e.itemCost, 0), 0
  )

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 border-4 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] active:translate-y-1 active:shadow-none">
              <ArrowLeft className="h-6 w-6 font-black" />
            </Link>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">Analytics</h1>
            </div>
          </div>
          <Badge variant="outline" className="border-2 border-foreground rounded-none font-black uppercase tracking-widest text-xs">
            LIVE
          </Badge>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <p className="text-3xl font-black">{formatCurrency(totalSpent)}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Total Investido</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <p className="text-3xl font-black">{formatCurrency(avgCostPerMaintenance)}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Custo Médio</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <p className="text-3xl font-black">{formatCurrency(monthlyAvg)}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Mensal Médio</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <p className="text-3xl font-black">{recentLogs.length}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Atividade 30d</p>
            </CardContent>
          </Card>
        </div>

        {/* Quality Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
            <CardHeader className="border-b-4 border-foreground pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                <Award className="h-5 w-5" />
                Qualidade das Peças
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 text-3xl font-black ${
                  oemPercentage >= 80 ? 'bg-green-100 border-green-600 text-green-800' :
                  oemPercentage >= 60 ? 'bg-yellow-100 border-yellow-600 text-yellow-800' :
                  'bg-red-100 border-red-600 text-red-800'
                }`}>
                  {oemPercentage}%
                </div>
                <p className="text-sm font-bold uppercase text-muted-foreground mt-2">Peças OEM</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold">Peças Originais:</span>
                  <span>{oemParts} de {allParts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Aftermarket:</span>
                  <span>{allParts.length - oemParts}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
            <CardHeader className="border-b-4 border-foreground pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                <Activity className="h-5 w-5" />
                Tipo de Manutenção
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 text-3xl font-black ${
                  preventivePercentage >= 70 ? 'bg-green-100 border-green-600 text-green-800' :
                  preventivePercentage >= 50 ? 'bg-yellow-100 border-yellow-600 text-yellow-800' :
                  'bg-red-100 border-red-600 text-red-800'
                }`}>
                  {preventivePercentage}%
                </div>
                <p className="text-sm font-bold uppercase text-muted-foreground mt-2">Preventivas</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold">Preventivas:</span>
                  <span>{preventiveCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Corretivas:</span>
                  <span>{vehicle.maintenanceLogs.length - preventiveCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
              <TrendingUp className="h-5 w-5" />
              Atividade Recente (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted border-2 border-dashed border-foreground rounded">
                <p className="text-2xl font-black">{recentLogs.length}</p>
                <p className="text-xs font-bold uppercase text-muted-foreground">Serviços</p>
              </div>
              <div className="text-center p-4 bg-muted border-2 border-dashed border-foreground rounded">
                <p className="text-2xl font-black">{formatCurrency(recentSpent)}</p>
                <p className="text-xs font-bold uppercase text-muted-foreground">Investido</p>
              </div>
              <div className="text-center p-4 bg-muted border-2 border-dashed border-foreground rounded">
                <p className="text-2xl font-black">
                  {recentLogs.length > 0 ? formatCurrency(recentSpent / recentLogs.length) : formatCurrency(0)}
                </p>
                <p className="text-xs font-bold uppercase text-muted-foreground">Média/Serviço</p>
              </div>
            </div>

            {recentLogs.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-black uppercase">Serviços Recentes:</h4>
                {recentLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex justify-between items-center p-2 border-2 border-foreground/20 rounded">
                    <div>
                      <p className="text-sm font-bold uppercase">{log.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString('pt-BR')} • {log.kmAtService}km
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="bg-muted border-4 border-dashed border-foreground rounded-none">
          <CardContent className="p-6">
            <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Insights de Performance
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold uppercase">Qualidade:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {oemPercentage >= 80 && <li>✅ Excelente qualidade de peças</li>}
                  {oemPercentage >= 60 && oemPercentage < 80 && <li>⚠️ Qualidade moderada de peças</li>}
                  {oemPercentage < 60 && <li>❌ Baixa qualidade de peças</li>}
                  {preventivePercentage >= 70 && <li>✅ Ótima manutenção preventiva</li>}
                  {preventivePercentage >= 50 && preventivePercentage < 70 && <li>⚠️ Manutenção preventiva moderada</li>}
                  {preventivePercentage < 50 && <li>❌ Baixa manutenção preventiva</li>}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold uppercase">Recomendações:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {monthlyAvg > 500 && <li>📈 Alto custo mensal detectado</li>}
                  {recentLogs.length < 2 && <li>📅 Baixa atividade recente</li>}
                  {avgCostPerMaintenance > 300 && <li>💰 Custo por serviço elevado</li>}
                  {vehicle.maintenanceLogs.length === 0 && <li>🆕 Comece registrando manutenções</li>}
                  {vehicle.maintenanceLogs.length > 10 && <li>📊 Histórico robusto estabelecido</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Link href="/maintenance/new">
            <Button className="w-full h-16 text-lg font-black uppercase border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_var(--foreground)] rounded-none hover:bg-foreground hover:text-background">
              Registrar Manutenção
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="w-full h-16 text-lg font-black uppercase border-4 border-foreground rounded-none">
              Configurações
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
