import { getFirstVehicle } from "../actions"
import { requireAuth } from "@/lib/auth-server"
import { Prisma } from "@prisma/client"

type VehicleBasic = Prisma.VehicleGetPayload<object>

/**
 * Server action to load existing vehicle for authenticated user
 * No mock data - requires real vehicle to be created first
 */
export async function loadOrCreateVehicle(): Promise<VehicleBasic> {
  const user = await requireAuth()
  const vehicle = await getFirstVehicle(user.id)
  
  if (!vehicle) {
    throw new Error("Nenhum veículo encontrado. Por favor, crie um veículo primeiro.")
  }

  return vehicle
}
