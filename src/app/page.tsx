import { getVehicleWithData, getPendingMaintenance } from "@/app/actions"
import { DashboardClient } from "@/components/dashboard-client"
import { loadOrCreateVehicle } from "@/hooks/use-vehicle-loader"

export default async function Home() {
  const vehicleBase = await loadOrCreateVehicle()

  const vehicle = await getVehicleWithData(vehicleBase.id)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Erro ao carregar veículo</p>
      </div>
    )
  }

  const pending = await getPendingMaintenance(vehicle.id)

  return <DashboardClient vehicle={vehicle} pending={pending} />
}
