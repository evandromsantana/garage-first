"use client"

import { getFirstVehicle, submitFullMaintenance } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MaintenanceFormData, maintenanceFormResolver } from "@/lib/form-resolvers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

interface MaintenanceFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<MaintenanceFormData>
}

export function MaintenanceForm({ onSuccess, onCancel, initialData }: MaintenanceFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<MaintenanceFormData>({
    resolver: maintenanceFormResolver,
    defaultValues: {
      type: "PREVENTIVE",
      description: "",
      kmAtService: 0,
      cost: undefined,
      parts: [],
      ...initialData,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  })

  const createMaintenanceMutation = useMutation({
    mutationFn: async (data: MaintenanceFormData) => {
      // Primeiro buscar o veículo para obter o ID
      const vehicle = await getFirstVehicle()
      if (!vehicle) {
        throw new Error("Nenhum veículo encontrado")
      }
      return submitFullMaintenance({
        vehicleId: vehicle.id,
        ...data,
        parts: data.parts || []
      })
    },
    onSuccess: () => {
      toast.success("Manutenção registrada com sucesso!")
      queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      queryClient.invalidateQueries({ queryKey: ['first-vehicle'] })
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      reset()
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao registrar manutenção")
    },
  })

  const onSubmit = (data: MaintenanceFormData) => {
    createMaintenanceMutation.mutate(data)
  }

  const addPart = () => {
    append({
      name: "",
      cost: 0,
      isOriginal: false,
    })
  }

  const maintenanceType = watch("type")

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Editar Manutenção" : "Registrar Nova Manutenção"}</CardTitle>
        <CardDescription>
          Preencha os detalhes da manutenção realizada no seu veículo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Manutenção</Label>
              <Select
                value={maintenanceType}
                onValueChange={(value) => setValue("type", value as any)}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREVENTIVE">Preventiva</SelectItem>
                  <SelectItem value="CORRECTIVE">Corretiva</SelectItem>
                  <SelectItem value="UPGRADE">Upgrade/Modificação</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kmAtService">KM no Serviço</Label>
              <Input
                id="kmAtService"
                type="number"
                placeholder="Ex: 15000"
                {...register("kmAtService", { valueAsNumber: true })}
                className={errors.kmAtService ? "border-red-500" : ""}
              />
              {errors.kmAtService && (
                <p className="text-sm text-red-500">{errors.kmAtService.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Custo (R$)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="Ex: 350.00"
                {...register("cost", { valueAsNumber: true })}
                className={errors.cost ? "border-red-500" : ""}
              />
              {errors.cost && (
                <p className="text-sm text-red-500">{errors.cost.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Opcional - deixe em branco se não houver custo
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente o que foi feito na manutenção..."
              rows={4}
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Seção de Peças */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Peças Utilizadas</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPart}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Peça
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground">
                  Nenhuma peça adicionada. Clique em "Adicionar Peça" para incluir.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`parts.${index}.name`}>Nome da Peça</Label>
                        <Input
                          id={`parts.${index}.name`}
                          placeholder="Ex: Filtro de óleo"
                          {...register(`parts.${index}.name`)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`parts.${index}.cost`}>Custo (R$)</Label>
                        <Input
                          id={`parts.${index}.cost`}
                          type="number"
                          step="0.01"
                          placeholder="Ex: 45.00"
                          {...register(`parts.${index}.cost`, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`parts.${index}.isOriginal`}>Original</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id={`parts.${index}.isOriginal`}
                            {...register(`parts.${index}.isOriginal`)}
                          />
                          <Label htmlFor={`parts.${index}.isOriginal`} className="text-sm">
                            Peça original
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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
                initialData ? "Atualizar Manutenção" : "Registrar Manutenção"
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
