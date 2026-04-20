import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wrench, Package, List } from "lucide-react"
import { getAllExpenses } from "@/app/actions"
import { ProjectExpense } from "@/types"
import { formatCurrency } from "@/lib/utils"

export default async function PartsPage() {
  const expenses = await getAllExpenses()

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="sticky top-0 z-10 border-b-4 border-foreground bg-background px-4 py-4 mb-4 shadow-[0_4px_0_0_colord(var(--foreground))]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-4 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] active:translate-y-1 active:shadow-none">
            <ArrowLeft className="h-6 w-6 font-black" />
          </Link>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Inventário</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_colord(var(--foreground))]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-foreground mb-3 border-b-2 border-foreground pb-2">
                <Package className="h-5 w-5 font-bold" />
                <span className="text-sm font-black uppercase">Totais</span>
              </div>
              <p className="text-4xl font-black">{expenses.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_colord(var(--foreground))]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-foreground mb-3 border-b-2 border-foreground pb-2">
                <Wrench className="h-5 w-5 font-bold" />
                <span className="text-sm font-black uppercase">Originais</span>
              </div>
              <p className="text-4xl font-black">{expenses.filter(p => p.isOriginalPart).length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase border-b-4 border-foreground pb-2 flex items-center gap-2 mt-8">
            <List className="h-6 w-6" />
            Registro de Peças
          </h2>
          
          {expenses.map(part => (
            <Card key={part.id} className="bg-background border-4 border-foreground rounded-none shadow-[2px_2px_0_0_colord(var(--foreground))] hover:bg-foreground/5 hover:translate-x-1 transition-transform cursor-pointer group">
              <CardContent className="p-0 flex justify-between items-stretch">
                <div className="p-4 flex-1">
                  <p className="font-black text-lg uppercase leading-none">{part.itemName}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2 tracking-widest group-hover:text-foreground">
                    [{part.maintenanceLog.type}] • {new Date(part.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 border-l-4 border-foreground flex flex-col justify-center items-end bg-muted">
                  <p className="font-black text-xl whitespace-nowrap">{formatCurrency(part.itemCost)}</p>
                  {part.isOriginalPart ? (
                     <Badge variant="outline" className="rounded-none border-2 border-foreground bg-foreground text-background font-black uppercase tracking-widest text-[10px] mt-1 shadow-none">OEM</Badge>
                  ) : (
                     <Badge variant="outline" className="rounded-none border-2 border-dashed border-foreground/50 text-foreground font-black uppercase tracking-widest text-[10px] mt-1 shadow-none bg-background">AFTER</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {expenses.length === 0 && (
            <p className="text-center font-bold text-muted-foreground uppercase pt-10">
              Nenhuma peça registrada no sistema.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
