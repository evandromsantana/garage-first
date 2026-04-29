import { z } from "zod"

export const maintenanceTypeEnum = z.enum(["PREVENTIVE", "CORRECTIVE", "UPGRADE"])

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "ID do veículo é obrigatório"),
  type: maintenanceTypeEnum,
  description: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  kmAtService: z
    .number()
    .min(0, "Quilometragem não pode ser negativa")
    .max(999999, "Quilometragem inválida"),
  cost: z.number().min(0, "Custo não pode ser negativo").optional(),
})

export const partSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da peça é obrigatório")
    .max(100, "Nome muito longo"),
  cost: z.number().min(0, "Custo não pode ser negativo"),
  isOriginal: z.boolean(),
})

export const vehicleSchema = z.object({
  model: z
    .string()
    .min(2, "Modelo deve ter pelo menos 2 caracteres")
    .max(100, "Modelo muito longo"),
  year: z
    .number()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear() + 1, "Ano no futuro"),
  currentKm: z.number().min(0, "Quilometragem não pode ser negativa"),
})

export const fullMaintenanceSchema = maintenanceSchema.extend({
  parts: z.array(partSchema).optional(),
})

export type MaintenanceInput = z.infer<typeof maintenanceSchema>
export type PartInput = z.infer<typeof partSchema>
export type VehicleInput = z.infer<typeof vehicleSchema>
export type FullMaintenanceInput = z.infer<typeof fullMaintenanceSchema>
