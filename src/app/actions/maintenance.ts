'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from "zod"
import { maintenanceLogSchema } from "@/lib/validations"
import { 
  CreateMaintenanceInput, 
  CreateExpenseInput, 
  SubmitFullMaintenanceInput, 
  MaintenanceStatus, 
  VehicleSummary 
} from '@/types'

export async function createMaintenanceExpense(data: CreateExpenseInput) {
  const expense = await prisma.projectExpense.create({
    data: {
      maintenanceId: data.maintenanceId,
      itemName: data.itemName,
      itemCost: data.itemCost,
      isOriginalPart: data.isOriginalPart ?? false,
    },
  })
  revalidatePath('/')
  return expense
}

export async function updateMaintenanceStatus(
  maintenanceId: string,
  status: MaintenanceStatus
) {
  const maintenance = await prisma.maintenanceLog.update({
    where: { id: maintenanceId },
    data: { status },
  })
  revalidatePath('/')
  return maintenance
}

export async function createMaintenanceLog(data: CreateMaintenanceInput) {
  try {
    const validatedData = maintenanceLogSchema.parse(data)

    const maintenance = await prisma.maintenanceLog.create({
      data: {
        ...validatedData,
        status: 'PENDING',
      },
    })
    revalidatePath('/')
    return maintenance
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(", ")}`)
    }
    throw error
  }
}

export async function submitFullMaintenance(data: SubmitFullMaintenanceInput) {
  try {
    const maintenance = await prisma.maintenanceLog.create({
      data: {
        vehicleId: data.vehicleId,
        type: data.type,
        description: data.description,
        kmAtService: data.kmAtService,
        status: 'COMPLETED',
        expenses: {
          create: data.parts.map(part => ({
            itemName: part.name,
            itemCost: Number(part.cost) || 0,
            isOriginalPart: part.isOriginal ?? false,
          }))
        }
      }
    })

    try {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } })
      if (vehicle && data.kmAtService > vehicle.currentKm) {
        await prisma.vehicle.update({
          where: { id: data.vehicleId },
          data: { currentKm: data.kmAtService }
        })
      }
    } catch (kmError) {
      console.error("Erro ao atualizar KM:", kmError)
    }

    try {
      const { requireAuth } = await import('@/lib/auth-server')
      const user = await requireAuth()

      if (user && data.parts.length > 0) {
        for (const part of data.parts) {
          if (!part.name && !part.inventoryItemId) continue
          
          let itemId = part.inventoryItemId
          
          if (!itemId) {
            const items = await prisma.$queryRawUnsafe(
              `SELECT id FROM InventoryItem WHERE userId = ? AND LOWER(name) = LOWER(?) LIMIT 1`,
              user.id, part.name
            ) as { id: string }[]
            if (items && items.length > 0) itemId = items[0]?.id
          }

          if (itemId) {
            await prisma.$executeRawUnsafe(
              `UPDATE InventoryItem SET quantity = MAX(0, quantity - 1), updatedAt = DATETIME('now') WHERE id = ?`,
              itemId
            )
          }
        }
      }
    } catch (inventoryError) {
      console.error("Erro ao processar baixa de estoque:", inventoryError)
    }

    revalidatePath('/')
    revalidatePath('/parts')
    revalidatePath('/inventory')
    return maintenance
  } catch (error) {
    console.error("Erro crítico em submitFullMaintenance:", error)
    throw new Error("Falha ao registrar serviço. Verifique os dados e tente novamente.")
  }
}

export async function getVehicleWithData(vehicleId: string): Promise<VehicleSummary | null> {
  const vehicles = await prisma.$queryRawUnsafe(
    `SELECT * FROM Vehicle WHERE id = ? LIMIT 1`,
    vehicleId
  ) as Record<string, any>[]
  
  if (!vehicles || vehicles.length === 0) return null
  
  const vehicle = vehicles[0]
  
  const logs = await prisma.maintenanceLog.findMany({
    where: { vehicleId },
    include: {
      expenses: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    ...vehicle,
    maintenanceLogs: logs
  } as unknown as VehicleSummary
}

export async function getPendingMaintenance(vehicleId: string) {
  return prisma.maintenanceLog.findMany({
    where: {
      vehicleId,
      status: 'PENDING',
    },
    include: {
      expenses: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function deleteMaintenanceLog(maintenanceId: string) {
  await prisma.projectExpense.deleteMany({
    where: { maintenanceId },
  })
  
  await prisma.maintenanceLog.delete({
    where: { id: maintenanceId },
  })
  
  revalidatePath('/')
}

export async function getAllExpenses(userId: string) {
  return prisma.projectExpense.findMany({
    include: {
      maintenanceLog: {
        include: {
          vehicle: true
        }
      },
    },
    where: {
      maintenanceLog: {
        vehicle: {
          userId
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
