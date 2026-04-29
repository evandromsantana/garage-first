import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Settings, Bike } from "lucide-react"
import { createVehicle } from "@/app/actions"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function SetupPage() {
  async function createInitialVehicle(formData: FormData) {
    "use server"
    
    const model = formData.get("model") as string
    const year = Number(formData.get("year"))
    const currentKm = Number(formData.get("currentKm"))
    
    if (!model || !year || !currentKm) {
      throw new Error("Todos os campos são obrigatórios")
    }
    
    // Get user from cookie
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value
    
    if (!authToken) {
      throw new Error("Usuário não autenticado")
    }
    
    const user = JSON.parse(authToken)
    
    await createVehicle({
      model,
      year,
      currentKm,
      userId: user.id
    })
    
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border-4 border-foreground text-foreground rounded-none transition-none shadow-[2px_2px_0_0_colord(var(--foreground))]">
            <Bike className="h-6 w-6 font-black" />
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Configuração Inicial</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24 max-w-md mx-auto">
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4 bg-foreground text-background">
            <CardTitle className="font-black uppercase text-lg">
              Cadastrar Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form action={createInitialVehicle} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider text-xs">Modelo</Label>
                <Input 
                  name="model" 
                  placeholder="Ex: Ninja 400" 
                  className="border-2 border-foreground rounded-none h-12 font-bold"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wider text-xs">Ano</Label>
                  <Input 
                    name="year" 
                    type="number" 
                    placeholder="2020" 
                    min="2000" 
                    max="2030"
                    className="border-2 border-foreground rounded-none h-12 font-bold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wider text-xs">Odômetro (KM)</Label>
                  <Input 
                    name="currentKm" 
                    type="number" 
                    placeholder="12500" 
                    min="0"
                    className="border-4 border-foreground rounded-none h-14 font-black text-xl px-4 focus-visible:ring-0 shadow-[inset_4px_4px_0_0_var(--background)]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-16 text-lg font-black uppercase tracking-widest border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_colord(var(--foreground))] rounded-none hover:bg-foreground hover:text-background hover:scale-[0.98] transition-transform">
                  <Plus className="h-6 w-6 mr-2" />
                  CRIAR VEÍCULO
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-muted border-4 border-dashed border-foreground/50 rounded-none">
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <h3 className="font-bold uppercase">Informações Necessárias:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Modelo exato da motocicleta</li>
                <li>• Ano de fabricação</li>
                <li>• Quilometragem atual (odômetro)</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Após criar o veículo, você poderá registrar manutenções e acompanhar todas as métricas.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
