import { getPendingMaintenance } from "@/app/actions"
import { DashboardClient } from "@/components/dashboard-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bike, Plus } from "lucide-react"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  // Verificar autenticação
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value
  
  console.log('🔍 [DASHBOARD] Verificando autenticação...')
  console.log('🔍 [DASHBOARD] Token encontrado:', authToken ? 'Sim' : 'Não')
  
  if (!authToken) {
    console.log('❌ [DASHBOARD] Token não encontrado, redirecionando para login')
    redirect('/auth/login')
  }
  
  const user = verifyToken(authToken)
  console.log('🔍 [DASHBOARD] Token verificado:', user ? 'Válido' : 'Inválido')
  
  if (!user) {
    console.log('❌ [DASHBOARD] Token inválido, redirecionando para login')
    redirect('/auth/login')
  }
  
  console.log('✅ [DASHBOARD] Usuário autenticado:', { id: user.id, email: user.email, name: user.name })

  // Buscar veículos do usuário com a estrutura correta para VehicleSummary
  const vehicles = await prisma.vehicle.findMany({
    where: { userId: user.id },
    include: {
      maintenanceLogs: {
        include: {
          expenses: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background font-mono flex items-center justify-center p-4">
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <Bike className="h-16 w-16 mx-auto text-foreground" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Bem-vindo, {user.name}!
              </h1>
              <p className="text-muted-foreground font-bold">
                Nenhum veículo cadastrado ainda.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Para começar a usar o Garage Ninja, cadastre sua motocicleta:
              </p>
              
              <Link href="/setup">
                <Button className="w-full h-16 text-lg font-black uppercase tracking-widest border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_var(--foreground)] rounded-none hover:bg-foreground hover:text-background hover:scale-[0.98] transition-transform">
                  <Plus className="h-6 w-6 mr-2" />
                  Cadastrar Veículo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Para simplificar, usar o primeiro veículo (futuramente implementar seleção)
  const vehicle = vehicles[0]
  const pending = await getPendingMaintenance(vehicle.id)

  return <DashboardClient vehicle={vehicle} pending={pending} />
}
