import { loadOrCreateVehicle, getInventoryItems } from "@/app/actions"
import NewMaintenanceForm from "@/components/maintenance/new-maintenance-form"
import { ErrorMessage } from "@/components/ui/error-message"

export default async function NewMaintenancePage() {
  const [vehicle, inventory] = await Promise.all([
    loadOrCreateVehicle(),
    getInventoryItems()
  ])

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage message="Sem veículo cadastrado no sistema" />
      </div>
    )
  }

  return (
    <NewMaintenanceForm 
      vehicleId={vehicle.id} 
      initialKm={vehicle.currentKm} 
      inventory={inventory} 
    />
  )
}
