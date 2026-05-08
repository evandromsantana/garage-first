"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOBD2 } from "@/hooks/use-obd2"
import { Bluetooth } from "lucide-react"
import { useState } from "react"

export function OBD2Widget() {
  const { data, history: _, error, connect, disconnect } = useOBD2()
  const [_view, _setView] = useState<"grid" | "flow">("grid")

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-4 border-b-4 border-foreground flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic">
            <Bluetooth className={`h-5 w-5 ${data.connected ? 'text-foreground' : 'opacity-20'}`} />
            Link Telemétrico
          </CardTitle>
          <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Interface ELM327 • Web Bluetooth</span>
        </div>
        <Button 
          variant={data.connected ? "destructive" : "default"}
          onClick={data.connected ? disconnect : connect}
          className="rounded-none border-4 border-foreground font-black uppercase text-xs h-10 px-4 shadow-[2px_2px_0_0_var(--foreground)] active:shadow-none active:translate-y-0.5 transition-all"
        >
          {data.connected ? "Desconectar" : "Sincronizar"}
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 divide-y-2 divide-foreground">
        {error && (
          <div className="p-4 bg-foreground text-background font-black uppercase text-[10px] text-center italic">
            ERRO: {error}
          </div>
        )}

        {!data.connected ? (
          <div className="py-2 flex flex-col items-center justify-center text-center space-y-4">
            <Bluetooth className="h-12 w-12 opacity-10" />
            <p className="text-[10px] font-black text-muted-foreground uppercase px-12 leading-relaxed">
              Conecte o adaptador OBD2 para ler o fluxo de dados em tempo real.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x-2 divide-foreground">
            <div className="p-6 flex flex-col items-center justify-center border-b-2 border-foreground">
               <span className="text-[9px] font-black uppercase opacity-40 mb-1">Rotação (RPM)</span>
               <span className="text-4xl font-black italic">{data.rpm > 0 ? data.rpm : <span className="text-xs animate-pulse">ESCANEANDO...</span>}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center border-b-2 border-foreground">
               <span className="text-[9px] font-black uppercase opacity-40 mb-1">Velocidade</span>
               <span className="text-4xl font-black italic">{data.speed > 0 ? `${data.speed}km/h` : <span className="text-xs animate-pulse">WAITING...</span>}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
               <span className="text-[9px] font-black uppercase opacity-40 mb-1">Temp. Motor</span>
               <span className="text-4xl font-black italic">{data.temp > 0 ? `${data.temp}°C` : <span className="text-xs animate-pulse">READING...</span>}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
               <span className="text-[9px] font-black uppercase opacity-40 mb-1">Carga Motor</span>
               <span className="text-4xl font-black italic">{data.engineLoad > 0 ? `${data.engineLoad}%` : <span className="text-xs animate-pulse">FETCHING...</span>}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
