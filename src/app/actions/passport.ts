'use server'

import { prisma } from '@/lib/db'

export async function getPublicVehiclePassport(vehicleId: string) {
  const vehicles = await prisma.$queryRawUnsafe(
    `SELECT id, ownerName, brand, model, year, plate, renavam, chassis, engineNumber, color, uf, currentKm, createdAt 
     FROM Vehicle WHERE id = ? LIMIT 1`,
    vehicleId
  ) as any[]
  
  if (!vehicles || vehicles.length === 0) return null
  
  const vehicle = vehicles[0]
  if (!vehicle) return null
  
  const logs = await prisma.maintenanceLog.findMany({
    where: { vehicleId, status: 'COMPLETED' },
    include: {
      expenses: {
        select: {
          itemName: true,
          itemCost: true,
          isOriginalPart: true
        }
      }
    },
    orderBy: {
      kmAtService: 'desc'
    }
  })
  
  return {
    id: vehicle['id'] as string,
    ownerName: vehicle['ownerName'] as string,
    brand: vehicle['brand'] as string,
    model: vehicle['model'] as string,
    year: vehicle['year'] as number,
    plate: vehicle['plate'] as string,
    color: vehicle['color'] as string,
    renavam: vehicle['renavam'] as string,
    currentKm: vehicle['currentKm'] as number,
    createdAt: vehicle['createdAt'] as Date,
    maintenanceLogs: logs
  }
}
