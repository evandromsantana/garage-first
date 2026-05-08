'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getMaintenanceRules(vehicleId: string) {
  return await prisma.maintenanceRule.findMany({
    where: { vehicleId },
    orderBy: { name: 'asc' }
  })
}

export async function createMaintenanceRule(data: {
  vehicleId: string
  name: string
  intervalKm: number
  intervalMonths?: number
  criticality: string
  category: string
}) {
  const rule = await prisma.maintenanceRule.create({
    data
  })
  revalidatePath('/settings')
  return rule
}

export async function deleteMaintenanceRule(id: string) {
  await prisma.maintenanceRule.delete({
    where: { id }
  })
  revalidatePath('/settings')
}

export async function updateMaintenanceRule(id: string, data: any) {
  const rule = await prisma.maintenanceRule.update({
    where: { id },
    data
  })
  revalidatePath('/settings')
  return rule
}

export async function seedDefaultRules(vehicleId: string) {
  const defaultRules = [
    { name: 'Óleo do Motor', intervalKm: 5000, intervalMonths: 6, criticality: 'high', category: 'engine' },
    { name: 'Filtro de Óleo', intervalKm: 5000, intervalMonths: 6, criticality: 'medium', category: 'engine' },
    { name: 'Fluido de Freio', intervalKm: 10000, intervalMonths: 24, criticality: 'high', category: 'brakes' },
    { name: 'Líquido Arrefecimento', intervalKm: 20000, intervalMonths: 24, criticality: 'medium', category: 'engine' },
    { name: 'Velas de Ignição', intervalKm: 12000, criticality: 'medium', category: 'engine' },
    { name: 'Kit Relação', intervalKm: 20000, criticality: 'critical', category: 'transmission' },
    { name: 'Pneu Dianteiro', intervalKm: 15000, criticality: 'high', category: 'tires' },
    { name: 'Pneu Traseiro', intervalKm: 12000, criticality: 'high', category: 'tires' },
  ]

  for (const rule of defaultRules) {
    await prisma.maintenanceRule.create({
      data: {
        ...rule,
        vehicleId
      }
    })
  }
  revalidatePath('/settings')
}
