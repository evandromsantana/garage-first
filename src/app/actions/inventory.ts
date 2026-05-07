'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { inventoryItemSchema } from "@/lib/validations"
import { InventoryItem, CreateInventoryItemInput } from '@/types'

export async function getInventoryItems(userId?: string): Promise<InventoryItem[]> {
  let finalUserId = userId
  
  if (!finalUserId) {
    const { requireAuth } = await import('@/lib/auth-server')
    const user = await requireAuth()
    finalUserId = user.id
  }

  return prisma.$queryRawUnsafe(`SELECT * FROM InventoryItem WHERE userId = ? ORDER BY name ASC`, finalUserId) as Promise<InventoryItem[]>
}

export async function createInventoryItem(data: CreateInventoryItemInput) {
  try {
    const { requireAuth } = await import('@/lib/auth-server')
    const user = await requireAuth()
    
    if (!user) return { success: false, error: "Usuário não autenticado" }

    try {
      const validatedData = inventoryItemSchema.parse(data)

      const item = await prisma.inventoryItem.create({
        data: {
          ...validatedData,
          userId: user.id
        }
      })
      revalidatePath('/inventory')
      revalidatePath('/parts')
      return { success: true, id: item.id }
    } catch (prismaError: unknown) {
      const message = prismaError instanceof Error ? prismaError.message : String(prismaError)
      console.warn("Prisma Client falhou ao criar item, tentando via Raw Query:", message)
      
      const id = crypto.randomUUID()
      await prisma.$executeRawUnsafe(
        `INSERT INTO InventoryItem (id, name, quantity, minQuantity, category, location, notes, userId, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))`,
        id, data.name, Number(data.quantity) || 0, Number(data.minQuantity) || 1, data.category, data.location || null, data.notes || null, user.id
      )
      
      revalidatePath('/inventory')
      revalidatePath('/parts')
      return { success: true, id }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Erro crítico em createInventoryItem:", error)
    return { success: false, error: errorMessage || "Erro desconhecido ao salvar" }
  }
}

export async function updateInventoryItemQuantity(id: string, delta: number) {
  await prisma.$executeRawUnsafe(
    `UPDATE InventoryItem SET quantity = quantity + ?, updatedAt = DATETIME('now') WHERE id = ?`,
    delta, id
  )
  
  revalidatePath('/inventory')
}

export async function deleteInventoryItem(id: string) {
  await prisma.$executeRawUnsafe(
    `DELETE FROM InventoryItem WHERE id = ?`,
    id
  )
  
  revalidatePath('/inventory')
}
