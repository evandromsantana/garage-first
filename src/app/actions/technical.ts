'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from "zod"
import { technicalSpecSchema } from "@/lib/validations"
import { TechnicalSpec } from '@/types'

export async function getTechnicalSpecs(vehicleId: string) {
  try {
    return await prisma.technicalSpec.findMany({
      where: { vehicleId },
      orderBy: { category: 'asc' }
    })
  } catch {
    const specs = await prisma.$queryRawUnsafe(
      `SELECT * FROM TechnicalSpec WHERE vehicleId = ? ORDER BY category ASC`,
      vehicleId
    ) as TechnicalSpec[]
    return specs
  }
}

export async function createTechnicalSpec(data: {
  vehicleId: string,
  category: string,
  component: string,
  value: string,
  notes?: string
}) {
  const { requireAuth } = await import('@/lib/auth-server')
  await requireAuth()
  
  try {
    const validatedData = technicalSpecSchema.parse(data)
    const spec = await prisma.technicalSpec.create({ data: validatedData })
    revalidatePath('/settings')
    return spec
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(", ")}`)
    }
    const id = crypto.randomUUID()
    await prisma.$executeRawUnsafe(
      `INSERT INTO TechnicalSpec (id, vehicleId, category, component, value, notes, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))`,
      id, data.vehicleId, data.category, data.component, data.value, data.notes || null
    )
    revalidatePath('/settings')
    return { id, ...data }
  }
}

export async function deleteTechnicalSpec(id: string) {
  const { requireAuth } = await import('@/lib/auth-server')
  await requireAuth()
  
  try {
    await prisma.technicalSpec.delete({ where: { id } })
  } catch {
    await prisma.$executeRawUnsafe(`DELETE FROM TechnicalSpec WHERE id = ?`, id)
  }
  revalidatePath('/settings')
}

export async function searchTechnicalSpecs(query: string) {
  const { requireAuth } = await import('@/lib/auth-server')
  const user = await requireAuth()

  // Buscar todas as specs dos veículos do usuário que combinem com a busca
  return await prisma.technicalSpec.findMany({
    where: {
      vehicle: { userId: user.id },
      OR: [
        { component: { contains: query } },
        { category: { contains: query } },
        { notes: { contains: query } }
      ]
    },
    orderBy: { category: 'asc' }
  })
}
