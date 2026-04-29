"use client"

import { useForm } from "react-hook-form"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { VehicleFormData, vehicleFormResolver } from "@/lib/form-resolvers"
import { createVehicle } from "@/app/actions"

interface VehicleFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<VehicleFormData>
}

export function VehicleForm({ onSuccess, onCancel, initialData }: VehicleFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VehicleFormData>({
    resolver: vehicleFormResolver,
    defaultValues: initialData || {},
  })

  const createVehicleMutation = useMutation({
    mutationFn: (data: VehicleFormData) => createVehicle(data),
    onSuccess: () => {
      toast.success("Veículo criado com sucesso!")
      queryClient.invalidateQueries({ queryKey: ['first-vehicle'] })
      queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      reset()
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar veículo")
    },
  })

  const onSubmit = (data: VehicleFormData) => {
    createVehicleMutation.mutate(data)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Editar Veículo" : "Cadastrar Novo Veículo"}</CardTitle>
        <CardDescription>
          Preencha as informações básicas do seu veículo para começar a controlar a manutenção.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model">Modelo do Veículo</Label>
              <Input
                id="model"
                placeholder="Ex: Kawasaki Ninja 400"
                {...register("model")}
                className={errors.model ? "border-red-500" : ""}
              />
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano do Modelo</Label>
              <Input
                id="year"
                type="number"
                placeholder="Ex: 2024"
                {...register("year", { valueAsNumber: true })}
                className={errors.year ? "border-red-500" : ""}
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentKm">Quilometragem Atual</Label>
            <Input
              id="currentKm"
              type="number"
              placeholder="Ex: 15000"
              {...register("currentKm", { valueAsNumber: true })}
              className={errors.currentKm ? "border-red-500" : ""}
            />
            {errors.currentKm && (
              <p className="text-sm text-red-500">{errors.currentKm.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Quilometragem atual do odômetro
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                initialData ? "Atualizar Veículo" : "Cadastrar Veículo"
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
