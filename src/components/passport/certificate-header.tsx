import { ShieldCheck } from "lucide-react"

interface CertificateHeaderProps {
  ownerName: string | null
  brand: string | null
  model: string
  plate: string | null
  uf: string | null
  year: number
  color: string | null
  renavam: string | null
  chassis: string | null
  engineNumber: string | null
  vehicleId: string
}

export function CertificateHeader({
  ownerName, brand, model, plate, uf, year, color, renavam, chassis, engineNumber, vehicleId
}: CertificateHeaderProps) {
  return (
    <div className="border-8 border-double border-foreground p-6 text-center space-y-4 bg-white shadow-xl animate-in fade-in zoom-in duration-700">
       <div className="flex justify-center relative">
         <ShieldCheck className="h-16 w-16 text-foreground" />
         <div className="absolute -right-2 -top-2 border-2 border-foreground p-1 bg-white">
            <img 
              src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(`https://garage-ninja.app/passport/${vehicleId}`)}&choe=UTF-8`} 
              alt="QR Code"
              className="h-12 w-12"
            />
            <p className="text-[6px] font-black leading-none mt-1">VERIFICAR<br/>ONLINE</p>
         </div>
       </div>
       <div className="space-y-1">
         <h1 className="text-4xl font-black uppercase tracking-tighter italic">CERTIFICADO DE MANUTENÇÃO</h1>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">SISTEMA GARAGE NINJA • REGISTRO OFICIAL</p>
       </div>
       <div className="py-4 border-y-2 border-foreground/10 space-y-4">
          <div className="text-left border-b border-foreground/5 pb-2">
            <p className="text-[9px] font-black opacity-40 uppercase">PROPRIETÁRIO / RESPONSÁVEL</p>
            <p className="text-md font-black uppercase">{ownerName || '---'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="text-left">
              <p className="text-[9px] font-black opacity-40 uppercase">MARCA / MODELO</p>
              <p className="text-sm font-black uppercase leading-tight">{brand ? `${brand} ${model}` : model}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black opacity-40 uppercase">PLACA / UF</p>
              <p className="text-sm font-black uppercase">{plate || '---'} {uf ? `[${uf}]` : ''}</p>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black opacity-40 uppercase">ANO / COR</p>
              <p className="text-sm font-black uppercase">{year} / {color || '---'}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black opacity-40 uppercase">RENAVAM</p>
              <p className="text-sm font-black uppercase tracking-widest">{renavam || '---'}</p>
            </div>
            <div className="text-left col-span-2 border-t border-foreground/5 pt-2">
              <p className="text-[9px] font-black opacity-40 uppercase">CHASSI</p>
              <p className="text-[11px] font-black uppercase tracking-[0.2em]">{chassis || '---'}</p>
            </div>
            <div className="text-left col-span-2">
              <p className="text-[9px] font-black opacity-40 uppercase">NÚMERO DO MOTOR</p>
              <p className="text-[11px] font-black uppercase tracking-[0.1em]">{engineNumber || '---'}</p>
            </div>
          </div>
       </div>
    </div>
  )
}
