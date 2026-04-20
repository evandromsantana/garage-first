import { getFirstVehicle, createVehicle } from "@/app/actions"
import { Prisma } from "@prisma/client"

const DEFAULT_VEHICLE = {
  model: "Ninja 400",
  year: 2020,
  currentKm: 12500,
}

type VehicleBasic = Prisma.VehicleGetPayload<object>

/**
 * Server function to load or create initial vehicle
 */
export async function loadOrCreateVehicle(): Promise<VehicleBasic> {
  let vehicle = await getFirstVehicle()

  if (!vehicle) {
    vehicle = await createVehicle(DEFAULT_VEHICLE)
  }

  return vehicle
}
