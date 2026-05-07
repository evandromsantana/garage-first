'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { vehicleSchema } from "@/lib/validations"
import { CreateVehicleInput } from '@/types'

export async function createVehicle(data: CreateVehicleInput) {
  const { requireAuth } = await import('@/lib/auth-server')
  const user = await requireAuth()
  
  const validatedData = vehicleSchema.parse(data)
  
  try {
    return await prisma.vehicle.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.warn("Prisma falhou ao criar veículo, tentando via Raw Query:", errorMessage)
    
    const id = crypto.randomUUID()
    await prisma.$executeRawUnsafe(
      `INSERT INTO Vehicle (id, ownerName, brand, model, year, currentKm, plate, renavam, chassis, engineNumber, color, uf, userId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))`,
      id, validatedData.ownerName || null, validatedData.brand || null, validatedData.model, validatedData.year, validatedData.currentKm ?? 0, validatedData.plate || null, validatedData.renavam || null, validatedData.chassis || null, validatedData.engineNumber || null, validatedData.color || null, validatedData.uf || null, user.id
    )
    
    return { id, ...data, userId: user.id }
  }
}

export async function updateVehicle(vehicleId: string, data: { 
  ownerName?: string,
  brand?: string, 
  model?: string, 
  currentKm?: number, 
  year?: number,
  plate?: string,
  renavam?: string,
  chassis?: string,
  engineNumber?: string,
  color?: string,
  uf?: string
}) {
  try {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData
    })
    revalidatePath('/')
    revalidatePath('/settings')
    revalidatePath('/passport')
    return vehicle
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.warn("Prisma falhou ao atualizar veículo, tentando via Raw Query:", errorMessage)
    
    await prisma.$executeRawUnsafe(
      `UPDATE Vehicle SET 
        ownerName = ?,
        brand = ?, 
        model = ?, 
        currentKm = ?, 
        year = ?, 
        plate = ?, 
        renavam = ?,
        chassis = ?, 
        engineNumber = ?,
        color = ?, 
        uf = ?,
        updatedAt = DATETIME('now') 
       WHERE id = ?`,
      data.ownerName || null,
      data.brand || null,
      data.model || '',
      data.currentKm || 0,
      data.year || 2024,
      data.plate || null,
      data.renavam || null,
      data.chassis || null,
      data.engineNumber || null,
      data.color || null,
      data.uf || null,
      vehicleId
    )
    
    revalidatePath('/')
    revalidatePath('/settings')
    revalidatePath('/passport')
    return { id: vehicleId, ...data }
  }
}

export async function updateVehicleKm(vehicleId: string, newKm: number) {
  return updateVehicle(vehicleId, { currentKm: newKm })
}

export async function getFirstVehicle() {
  try {
    const { requireAuth } = await import('@/lib/auth-server')
    const user = await requireAuth()
    
    if (!user) return null

    return prisma.vehicle.findFirst({
      where: { userId: user.id }
    })
  } catch (error) {
    console.error("Erro ao buscar veículo:", error)
    return null
  }
}

export async function loadOrCreateVehicle() {
  const { requireAuth } = await import('@/lib/auth-server')
  await requireAuth()
  const vehicle = await getFirstVehicle()
  
  if (!vehicle) {
    throw new Error("Nenhum veículo encontrado. Por favor, crie um veículo primeiro.")
  }

  return vehicle
}
