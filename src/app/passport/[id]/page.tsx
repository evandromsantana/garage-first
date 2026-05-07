import { getPublicVehiclePassport } from "@/app/actions"
import { formatCurrency } from "@/lib"
import { Calendar, ShieldCheck } from "lucide-react"

export default async function PublicPassportPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const vehicle = await getPublicVehiclePassport(id)
  
  if (!vehicle) {
    return (
      <div className="kindle-page flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <ShieldCheck className="h-20 w-20 opacity-10 mb-4" />
        <h1 className="text-2xl font-black uppercase italic">DOCUMENTO NÃO ENCONTRADO</h1>
        <p className="text-sm font-black uppercase opacity-40 mt-2">Este certificado não existe ou foi removido do sistema.</p>
      </div>
    )
  }
  
  const totalInvested = vehicle.maintenanceLogs.reduce((acc: number, log: any) => {
    const partsSum = log.expenses.reduce((eAcc: number, exp: any) => eAcc + exp.itemCost, 0)
    return acc + (log.cost || 0) + partsSum
  }, 0)

  return (
    <div className="kindle-page bg-zinc-50 min-h-screen pb-20">
      <div className="bg-foreground text-background p-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">VERIFICAÇÃO PÚBLICA DE PROCEDÊNCIA</p>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto">
        {/* Certificate Header */}
        <div className="border-8 border-double border-foreground p-6 text-center space-y-4 bg-white shadow-xl">
           <div className="flex justify-center relative">
             <ShieldCheck className="h-16 w-16 text-foreground" />
             {/* QR Code Seal */}
             <div className="absolute -right-2 -top-2 border-2 border-foreground p-1 bg-white">
                <img 
                  src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(`https://garage-ninja.app/passport/${vehicle.id}`)}&choe=UTF-8`} 
                  alt="QR Code"
                  className="h-10 w-10"
                />
             </div>
           </div>
           <div className="space-y-1">
             <h1 className="text-4xl font-black uppercase tracking-tighter italic">CERTIFICADO DE MANUTENÇÃO</h1>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">SISTEMA GARAGE NINJA • REGISTRO OFICIAL</p>
           </div>
           
           <div className="py-4 border-y-2 border-foreground/10 space-y-4">
              <div className="text-left border-b border-foreground/5 pb-2">
                <p className="text-[9px] font-black opacity-40 uppercase">PROPRIETÁRIO / RESPONSÁVEL</p>
                <p className="text-md font-black uppercase">{vehicle.ownerName || '---'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="text-left">
                  <p className="text-[9px] font-black opacity-40 uppercase">MARCA / MODELO</p>
                  <p className="text-sm font-black uppercase leading-tight">{vehicle.brand ? `${vehicle.brand} ${vehicle.model}` : vehicle.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black opacity-40 uppercase">PLACA</p>
                  <p className="text-sm font-black uppercase">{vehicle.plate || '---'}</p>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black opacity-40 uppercase">ANO / COR</p>
                  <p className="text-sm font-black uppercase">{vehicle.year} / {vehicle.color || '---'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black opacity-40 uppercase">RENAVAM</p>
                  <p className="text-sm font-black uppercase tracking-widest">{vehicle.renavam || '---'}</p>
                </div>
              </div>
           </div>
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-2 gap-4">
           <div className="kindle-card bg-foreground text-background p-4 space-y-1">
              <p className="text-[9px] font-black opacity-60 uppercase">TOTAL INVESTIDO</p>
              <p className="text-xl font-black">{formatCurrency(totalInvested)}</p>
           </div>
           <div className="kindle-card p-4 space-y-1">
              <p className="text-[9px] font-black opacity-40 uppercase">STATUS DE PROCEDÊNCIA</p>
              <p className="text-xl font-black text-green-600 uppercase italic">VERIFICADO</p>
           </div>
        </div>

        {/* Timeline of Excellence */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 border-b-4 border-foreground pb-2">
             <Calendar className="h-5 w-5" />
             <h2 className="text-lg font-black uppercase italic">HISTÓRICO TÉCNICO</h2>
           </div>

           <div className="relative border-l-4 border-foreground ml-4 pl-8 space-y-10 py-4">
              {vehicle.maintenanceLogs.length === 0 ? (
                <div className="text-center p-10 opacity-30 italic uppercase font-black text-sm">
                   Nenhum registro público disponível.
                </div>
              ) : (
                vehicle.maintenanceLogs.map((log: any) => (
                  <div key={log.id} className="relative group">
                    <div className="absolute -left-[42px] top-1 h-6 w-6 rounded-full bg-foreground border-4 border-zinc-50 flex items-center justify-center">
                       <div className="h-2 w-2 bg-zinc-50 rounded-full" />
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <span className="text-xl font-black uppercase tracking-tighter">{log.description}</span>
                          <span className="font-mono text-xs font-black bg-zinc-200 px-2 py-0.5">{log.kmAtService.toLocaleString()} KM</span>
                       </div>
                       <div className="flex gap-4 text-[10px] font-black opacity-60 uppercase tracking-widest">
                          <span>📅 {new Date(log.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span>🛠️ {log.type}</span>
                       </div>
                       
                       {log.expenses.length > 0 && (
                         <div className="mt-3 p-3 bg-white border-2 border-foreground/10 rounded-none space-y-1">
                            <p className="text-[9px] font-black opacity-40 mb-1">COMPONENTES SUBSTITUÍDOS:</p>
                            {log.expenses.map((exp: any, i: number) => (
                              <div key={i} className="flex justify-between text-[10px] font-bold uppercase">
                                <span>• {exp.itemName}</span>
                                {exp.isOriginalPart && <span className="text-[8px] bg-foreground text-background px-1 ml-2">ORIGINAL</span>}
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                  </div>
                ))
              )}
           </div>
        </section>

        {/* Authenticity Footer */}
        <div className="border-4 border-dashed border-foreground/20 p-6 text-center space-y-3 bg-zinc-100">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">CHAVE DE AUTENTICIDADE</p>
           <p className="font-mono text-[8px] break-all opacity-40">{id}</p>
           <p className="text-[8px] font-bold text-muted-foreground uppercase leading-tight">
             Este registro é público e auditável. As informações aqui contidas foram registradas via sistema Garage Ninja e são de responsabilidade do proprietário.
           </p>
        </div>
      </main>
    </div>
  )
}
