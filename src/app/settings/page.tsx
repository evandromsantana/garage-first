import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Settings, Save, AlertTriangle, FileText } from "lucide-react"
import { updateVehicleKm } from "@/app/actions"
import { revalidatePath } from "next/cache"
import { loadOrCreateVehicle } from "@/hooks/use-vehicle-loader"

export default async function SettingsPage() {
  const vehicle = await loadOrCreateVehicle()

  const saveSettings = async (formData: FormData) => {
    "use server"
    const newKm = Number(formData.get("km"))
    if (vehicle && newKm) {
      await updateVehicleKm(vehicle.id, newKm)
      revalidatePath("/settings")
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 border-4 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] active:translate-y-1 active:shadow-none">
              <ArrowLeft className="h-6 w-6 font-black" />
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">Ajustes</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_colord(var(--foreground))]">
          <CardHeader className="border-b-4 border-foreground pb-4 bg-foreground text-background">
            <CardTitle className="font-black flex items-center gap-2 uppercase text-lg">
              Painel do Veículo
            </CardTitle>
            <CardDescription className="text-background/80 font-bold uppercase text-xs tracking-wider">
              [ {vehicle?.model || "Moto"} - {vehicle?.year || "Ano"} ]
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <form action={saveSettings} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider text-xs">Modelo</Label>
                <Input disabled defaultValue={vehicle?.model} className="border-2 border-foreground rounded-none h-12 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wider text-xs">Ano</Label>
                  <Input disabled defaultValue={vehicle?.year} type="number" className="border-2 border-foreground rounded-none h-12 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wider text-xs">Odômetro Mestre (KM)</Label>
                  <Input name="km" defaultValue={vehicle?.currentKm} type="number" className="border-4 border-foreground rounded-none h-14 font-black text-xl px-4 focus-visible:ring-0 shadow-[inset_4px_4px_0_0_var(--background)]" />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-16 text-lg font-black uppercase tracking-widest border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_colord(var(--foreground))] rounded-none hover:bg-foreground hover:text-background hover:scale-[0.98] transition-transform">
                  <Save className="h-6 w-6 mr-2" />
                  GRAVAR ODÔMETRO
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-background border-4 border-dashed border-foreground/50 rounded-none shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertTriangle className="h-8 w-8" />
              <div>
                <p className="font-bold uppercase text-sm">Atenção</p>
                <p className="text-xs uppercase">Estes dados afetarão o cálculo automático de preventivas.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/passport" className="block w-full">
          <Button variant="outline" className="w-full h-20 text-lg font-black uppercase tracking-widest border-4 border-foreground rounded-none bg-foreground text-background shadow-[4px_4px_0_0_colord(var(--background))] hover:scale-[0.98] transition-transform flex items-center justify-center gap-3">
            <FileText className="h-8 w-8" />
            VISUALIZAR PASSAPORTE
          </Button>
        </Link>

      </main>
    </div>
  )
}
