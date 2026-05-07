import { z } from "zod"

export const vehicleSchema = z.object({
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  brand: z.string().nullish().transform(v => v ?? null),
  plate: z.string().nullish().transform(v => v ?? null),
  currentKm: z.coerce.number().min(0).default(0),
  ownerName: z.string().nullish().transform(v => v ?? null),
  renavam: z.string().nullish().transform(v => v ?? null),
  chassis: z.string().nullish().transform(v => v ?? null),
  engineNumber: z.string().nullish().transform(v => v ?? null),
  color: z.string().nullish().transform(v => v ?? null),
  uf: z.string().nullish().transform(v => v ?? null),
})

export const maintenanceLogSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'UPGRADE']),
  description: z.string().min(3, "Descrição muito curta"),
  kmAtService: z.coerce.number().min(0),
  cost: z.coerce.number().nullish().transform(v => v ?? null),
  diagramCode: z.string().nullish().transform(v => v ?? null),
})

export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.coerce.number().min(0),
  minQuantity: z.coerce.number().min(0).default(1),
  category: z.enum(['CONSUMABLE', 'PART', 'TOOL']),
  location: z.string().nullish().transform(v => v ?? null),
  notes: z.string().nullish().transform(v => v ?? null),
})

export const technicalSpecSchema = z.object({
  vehicleId: z.string().uuid(),
  category: z.string().min(1),
  component: z.string().min(1),
  value: z.string().min(1),
  notes: z.string().nullish().transform(v => v ?? null),
})
