"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trash2, Check, X, Wrench } from "lucide-react"
import { useMaintenance } from "@/hooks/use-maintenance"
import { Loading } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/ui/error-message"
import { calculateTotalSpent, formatCurrency } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"

export default function MaintenanceDetailPage() {
  const params = useParams()
  const { maintenance, loading, handleStatusChange, handleDelete } = useMaintenance(
    params.id as string
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading message="Carregando detalhes..." />
      </div>
    )
  }

  if (!maintenance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ErrorMessage message="Manutenção não encontrada" />
      </div>
    )
  }

  const totalCost = calculateTotalSpent([maintenance])

  return (
    <div className="min-h-screen bg-background font-mono text-foreground">
      <PageHeader title="Detalhes do Serviço" backHref="/" className="mb-0" />

      <main className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
        {/* Tipo e Status */}
        <Card className="rounded-none border-4 border-foreground shadow-[4px_4px_0_0_colord(var(--foreground))]">
          <CardHeader className="pb-3 border-b-2 border-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black uppercase flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                {maintenance.type === "PREVENTIVE" && "Preventiva"}
                {maintenance.type === "CORRECTIVE" && "Corretiva"}
                {maintenance.type === "UPGRADE" && "Upgrade"}
              </CardTitle>
              <Badge 
                variant="outline"
                className={`text-sm rounded-none font-black uppercase tracking-widest ${maintenance.status === "COMPLETED" ? "bg-foreground text-background border-foreground" : "border-dashed border-foreground text-muted-foreground"}`}
              >
                {maintenance.status === "COMPLETED" ? "FEITO" : "PENDENTE"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <p className="text-xl font-black uppercase">{maintenance.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border-2 border-foreground relative overflow-hidden bg-muted">
                <span className="absolute top-0 right-0 p-1 bg-foreground text-background text-[10px] font-black uppercase">KM</span>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Odômetro</p>
                <p className="text-xl font-black">{maintenance.kmAtService.toLocaleString()}</p>
              </div>
              <div className="p-3 border-2 border-foreground relative overflow-hidden bg-muted">
                <span className="absolute top-0 right-0 p-1 bg-foreground text-background text-[10px] font-black uppercase">R$</span>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Custo Total</p>
                <p className="text-xl font-black">{formatCurrency(totalCost)}</p>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest border-t-2 border-dashed border-foreground/30 pt-3 opacity-60">
              Registrado em: {new Date(maintenance.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        {/* Peças/Despesas */}
        {maintenance.expenses.length > 0 && (
          <div className="space-y-3">
             <h2 className="text-lg font-black uppercase border-b-2 border-foreground pb-1">Peças Trocadas</h2>
              {maintenance.expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border-l-4 border-foreground bg-muted">
                  <div>
                    <p className="font-bold uppercase text-base">{expense.itemName}</p>
                    {expense.isOriginalPart ? (
                      <Badge variant="outline" className="text-[10px] rounded-none border-foreground font-black uppercase tracking-widest mt-1 bg-foreground text-background">OEM</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] rounded-none border-dashed border-foreground font-bold text-muted-foreground uppercase tracking-widest mt-1">AFTERMARKET</Badge>
                    )}
                  </div>
                  <p className="font-black text-lg">{formatCurrency(expense.itemCost)}</p>
                </div>
              ))}
          </div>
        )}

        {/* Ações */}
        <div className="grid grid-cols-2 gap-3 pt-6">
          <Button
            variant="outline"
            size="lg"
            className={`h-16 rounded-none border-4 border-foreground font-black uppercase tracking-widest text-sm transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] hover:translate-y-1 hover:shadow-none ${maintenance.status === "COMPLETED" ? "bg-muted text-foreground line-through" : "bg-foreground text-background"}`}
            onClick={() => handleStatusChange(maintenance.status === "COMPLETED" ? "PENDING" : "COMPLETED")}
          >
            {maintenance.status === "COMPLETED" ? (
              <>
                <X className="h-5 w-5 mr-2" />
                Desmarcar
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Validar
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-16 rounded-none border-4 border-foreground font-black uppercase tracking-widest text-sm text-foreground bg-background hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-none shadow-[2px_2px_0_0_colord(var(--foreground))] hover:translate-y-1 hover:shadow-none"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Deletar
          </Button>
        </div>
      </main>
    </div>
  )
}
