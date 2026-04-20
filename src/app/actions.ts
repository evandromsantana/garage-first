'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  CreateVehicleInput,
  CreateMaintenanceInput,
  CreateExpenseInput,
  SubmitFullMaintenanceInput,
  MaintenanceStatus
} from '@/types'

export async function createVehicle(data: CreateVehicleInput) {
  return prisma.vehicle.create({
    data: {
      model: data.model,
      year: data.year,
      currentKm: data.currentKm ?? 0,
    },
  })
}

export async function updateVehicleKm(vehicleId: string, newKm: number) {
  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { currentKm: newKm },
  })
  revalidatePath('/')
  return vehicle
}

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
  const maintenance = await prisma.maintenanceLog.create({
    data: {
      vehicleId: data.vehicleId,
      type: data.type,
      description: data.description,
      kmAtService: data.kmAtService,
      cost: data.cost,
      diagramCode: data.diagramCode,
      status: 'PENDING',
    },
  })
  revalidatePath('/')
  return maintenance
}

export async function submitFullMaintenance(data: SubmitFullMaintenanceInput) {
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
          itemCost: part.cost,
          isOriginalPart: part.isOriginal,
        }))
      }
    }
  })

  // Optionally update vehicle KM if this service KM is higher
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } })
  if (vehicle && data.kmAtService > vehicle.currentKm) {
    await prisma.vehicle.update({
      where: { id: data.vehicleId },
      data: { currentKm: data.kmAtService }
    })
  }

  revalidatePath('/')
  revalidatePath('/parts')
  return maintenance
}

export async function getVehicleWithData(vehicleId: string) {
  return prisma.vehicle.findUnique({
    where: { id: vehicleId },
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
  // Primeiro deleta as despesas relacionadas
  await prisma.projectExpense.deleteMany({
    where: { maintenanceId },
  })
  
  // Depois deleta o log
  await prisma.maintenanceLog.delete({
    where: { id: maintenanceId },
  })
  
  revalidatePath('/')
}

export async function searchTechnicalSpecs(query: string) {
  const lowerQuery = query.toLowerCase()
  return prisma.technicalSpec.findMany({
    where: {
      OR: [
        { component: { contains: lowerQuery } },
        { category: { contains: lowerQuery } },
        { notes: { contains: lowerQuery } },
      ],
    },
  })
}

export async function getFirstVehicle() {
  return prisma.vehicle.findFirst()
}

export async function getAllExpenses() {
  return prisma.projectExpense.findMany({
    include: {
      maintenanceLog: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
