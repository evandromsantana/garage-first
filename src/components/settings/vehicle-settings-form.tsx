"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"
import { updateVehicle } from "@/app/actions"
import { toast } from "sonner"
import { haptics } from "@/lib/haptics"

interface VehicleSettingsFormProps {
  vehicle: {
    id: string
    ownerName: string | null
    brand: string | null
    model: string
    currentKm: number
    year: number
    plate: string | null
    renavam: string | null
    chassis: string | null
    engineNumber: string | null
    color: string | null
    uf: string | null
    purchasePrice: number | null
    currentMarketValue: number | null
  }
}

export function VehicleSettingsForm({ vehicle }: VehicleSettingsFormProps) {
  const [ownerName, setOwnerName] = useState(vehicle.ownerName || "")
  const [brand, setBrand] = useState(vehicle.brand || "")
  const [model, setModel] = useState(vehicle.model)
  const [year, setYear] = useState(vehicle.year)
  const [plate, setPlate] = useState(vehicle.plate || "")
  const [renavam, setRenavam] = useState(vehicle.renavam || "")
  const [chassis, setChassis] = useState(vehicle.chassis || "")
  const [engineNumber, setEngineNumber] = useState(vehicle.engineNumber || "")
  const [color, setColor] = useState(vehicle.color || "")
  const [uf, setUf] = useState(vehicle.uf || "")
  const [km, setKm] = useState(vehicle.currentKm)
  const [purchasePrice, setPurchasePrice] = useState(vehicle.purchasePrice || 0)
  const [marketValue, setMarketValue] = useState(vehicle.currentMarketValue || 0)
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    haptics.light()
    
    try {
      await updateVehicle(vehicle.id, {
        ownerName,
        brand,
        model,
        year: Number(year),
        plate,
        renavam,
        chassis,
        engineNumber,
        color,
        uf,
        currentKm: Number(km),
        purchasePrice: Number(purchasePrice),
        currentMarketValue: Number(marketValue)
      })
      toast.success("Configurações atualizadas")
      haptics.success()
    } catch (error) {
      toast.error("Erro ao atualizar")
      haptics.error()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="kindle-card">
      <CardHeader className="pb-6 border-b-4 border-foreground">
        <CardTitle className="text-xl font-black uppercase italic">DADOS TÉCNICOS DO VEÍCULO</CardTitle>
        <CardDescription className="font-black uppercase text-[10px] tracking-[0.2em] opacity-60">
          ID DE REGISTRO: {vehicle.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">NOME DO PROPRIETÁRIO / RESPONSÁVEL</Label>
              <Input 
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">MARCA (EX: KAWASAKI)</Label>
              <Input 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">MODELO (EX: NINJA 400)</Label>
              <Input 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">ANO FABRICAÇÃO</Label>
              <Input 
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border-4 border-foreground rounded-none h-14 font-black text-sm focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">COR DOMINANTE</Label>
              <Input 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">ESTADO (UF)</Label>
              <Input 
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                placeholder="SP"
                maxLength={2}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">PLACA (PADRÃO MERCOSUL)</Label>
              <Input 
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="ABC1D23"
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">RENAVAM (11 DÍGITOS)</Label>
              <Input 
                value={renavam}
                onChange={(e) => setRenavam(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">CHASSI (17 DÍGITOS)</Label>
              <Input 
                value={chassis}
                onChange={(e) => setChassis(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">NÚMERO DO MOTOR</Label>
              <Input 
                value={engineNumber}
                onChange={(e) => setEngineNumber(e.target.value)}
                className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm uppercase focus-visible:ring-0" 
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">ODÔMETRO ATUAL (KM)</Label>
              <Input 
                type="number"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="border-4 border-foreground rounded-none h-20 font-black text-4xl focus-visible:ring-0" 
              />
            </div>
            
            <div className="border-t-4 border-foreground pt-4 mt-4 sm:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Parâmetros Financeiros (Wealth Advisor)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">PREÇO DE COMPRA (R$)</Label>
                  <Input 
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm focus-visible:ring-0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">VALOR DE MERCADO ATUAL (R$)</Label>
                  <Input 
                    type="number"
                    value={marketValue}
                    onChange={(e) => setMarketValue(Number(e.target.value))}
                    className="border-4 border-foreground rounded-none h-14 bg-background font-black text-sm focus-visible:ring-0" 
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="kindle-button w-full h-20 text-xl">
            {loading ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : <Save className="h-6 w-6 mr-3" />}
            EFETIVAR ATUALIZAÇÃO TÉCNICA
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
