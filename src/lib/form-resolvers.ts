import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Schemas
export const vehicleSchema = z.object({
  model: z.string().min(2, "Modelo deve ter pelo menos 2 caracteres").max(100, "Modelo muito longo"),
  year: z.number().min(1900, "Ano inválido").max(new Date().getFullYear() + 1, "Ano no futuro"),
  currentKm: z.number().min(0, "Quilometragem não pode ser negativa"),
})

export const maintenanceSchema = z.object({
  type: z.enum(["PREVENTIVE", "CORRECTIVE", "UPGRADE"], {
    required_error: "Tipo de manutenção é obrigatório",
  }),
  description: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  kmAtService: z
    .number()
    .min(0, "Quilometragem não pode ser negativa")
    .max(999999, "Quilometragem inválida"),
  cost: z.number().min(0, "Custo não pode ser negativo").optional(),
  parts: z.array(
    z.object({
      name: z.string().min(1, "Nome da peça é obrigatório").max(100, "Nome muito longo"),
      cost: z.number().min(0, "Custo não pode ser negativo"),
      isOriginal: z.boolean(),
    })
  ).optional(),
})

export const partSchema = z.object({
  name: z.string().min(1, "Nome da peça é obrigatório").max(100, "Nome muito longo"),
  cost: z.number().min(0, "Custo não pode ser negativo"),
  isOriginal: z.boolean(),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

export const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
})

// Resolvers
export const vehicleFormResolver = zodResolver(vehicleSchema)
export const maintenanceFormResolver = zodResolver(maintenanceSchema)
export const partFormResolver = zodResolver(partSchema)
export const loginFormResolver = zodResolver(loginSchema)
export const registerFormResolver = zodResolver(registerSchema)
export const profileFormResolver = zodResolver(profileSchema)

// Types inferidos para uso nos componentes
export type VehicleFormData = z.infer<typeof vehicleSchema>
export type MaintenanceFormData = z.infer<typeof maintenanceSchema>
export type PartFormData = z.infer<typeof partSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
