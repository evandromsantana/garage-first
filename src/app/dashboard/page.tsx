import { getInventoryItems, getPendingMaintenance, getTechnicalSpecs } from "@/app/actions"
export const unstable_instant = false

import DashboardClient from "@/components/dashboard-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/db"
import { VehicleSummary } from "@/types"
import { Bike, Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  let user;
  try {
    user = await requireAuth()
  } catch (_error) {
    redirect('/auth/login')
  }
  
  console.log('✅ [DASHBOARD] Usuário autenticado:', { id: user.id, email: user.email, name: user.name })

  // Iniciar todas as buscas de dados em paralelo para otimizar o carregamento
  // Primeiro buscamos o usuário e seus veículos básicos
  const vehicles = await prisma.vehicle.findMany({
    where: { userId: user.id },
    select: { id: true, model: true, brand: true, currentKm: true, year: true, color: true, plate: true }
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
  const baseVehicle = vehicles[0]
  if (!baseVehicle) return null

  // Buscar detalhes do veículo, tarefas pendentes, inventário e especificações em paralelo
  const [vehicleData, pending, inventory, specs] = await Promise.all([
    prisma.vehicle.findUnique({
      where: { id: baseVehicle.id },
      include: {
        maintenanceLogs: {
          include: { expenses: true },
          orderBy: { createdAt: 'desc' },
          take: 50, // Limitar para performance, mas manter o suficiente para predição
        },
      },
    }),
    getPendingMaintenance(baseVehicle.id),
    getInventoryItems(user.id),
    getTechnicalSpecs(baseVehicle.id)
  ])

  if (!vehicleData) return null

  // Transform explicit type if needed or rely on inferred
  const vehicleSummary: VehicleSummary = {
    ...vehicleData,
    ownerName: vehicleData.ownerName || null,
    brand: vehicleData.brand || null,
    plate: vehicleData.plate || null,
    renavam: vehicleData.renavam || null,
    chassis: vehicleData.chassis || null,
    engineNumber: vehicleData.engineNumber || null,
    color: vehicleData.color || null,
    uf: vehicleData.uf || null,
    maintenanceLogs: vehicleData.maintenanceLogs as any // Type-safe cast needed for complex relations
  }

  return <DashboardClient vehicle={vehicleSummary} pending={pending} inventory={inventory} specs={specs} />

}
