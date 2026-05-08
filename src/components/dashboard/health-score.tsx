"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleHealthScore } from "@/types";
import { ShieldAlert, Activity, Droplets, Zap } from "lucide-react"

interface SystemHealth {
  name: string;
  status: number; // 0 to 100
  pos: { x: string; y: string };
  icon: React.ReactNode;
}

export function HealthScore({ health }: { health: VehicleHealthScore }) {
  const systems: SystemHealth[] = [
    { name: "Motor", status: health.engine, pos: { x: "45%", y: "55%" }, icon: <Activity className="h-4 w-4" /> },
    { name: "Transmissão", status: 100, pos: { x: "65%", y: "65%" }, icon: <Zap className="h-4 w-4" /> }, // Transmissão não tem score específico no hook ainda, usando 100
    { name: "Fluidos", status: 100, pos: { x: "40%", y: "45%" }, icon: <Droplets className="h-4 w-4" /> },
    { name: "Freios", status: health.brakes, pos: { x: "20%", y: "70%" }, icon: <ShieldAlert className="h-4 w-4" /> },
  ]

  return (
    <Card className="bg-zinc-950 border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] overflow-hidden">
      <CardHeader className="border-b-4 border-foreground bg-zinc-900 pb-4">
        <CardTitle className="font-black uppercase text-white flex items-center gap-2 italic">
          <Activity className="h-6 w-6 text-green-500" />
          Status Tático de Sistemas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative h-64 sm:h-80 bg-[url('/images/ninja-blueprint.png')] bg-contain bg-center bg-no-repeat">
        {/* Overlay Darkener */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Radar Scanning Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-1/2 w-full animate-pulse top-0" />

        {systems.map((sys, idx) => (
          <div 
            key={idx} 
            className="absolute transition-all hover:scale-110 cursor-help group"
            style={{ left: sys.pos.x, top: sys.pos.y }}
          >
            {/* Connection Line */}
            <div className="absolute w-8 h-[2px] bg-foreground/50 -left-8 top-1/2 hidden group-hover:block" />
            
            {/* Status Point */}
            <div className={`h-4 w-4 rounded-full border-2 border-white animate-ping absolute ${sys.status > 80 ? 'bg-green-500' : sys.status > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <div className={`h-4 w-4 rounded-full border-2 border-white relative z-10 ${sys.status > 80 ? 'bg-green-500' : sys.status > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            
            {/* Tooltip */}
            <div className="absolute left-6 -top-2 bg-foreground text-background p-2 border-2 border-background hidden group-hover:block z-20 min-w-[120px]">
               <div className="flex items-center gap-2 mb-1">
                 {sys.icon}
                 <span className="text-[10px] font-black uppercase">{sys.name}</span>
               </div>
               <div className="h-2 w-full bg-background/20 overflow-hidden">
                  <div className="h-full bg-background" style={{ width: `${sys.status}%` }} />
               </div>
               <div className="text-[14px] font-black mt-1">{sys.status}% HEALTH</div>
            </div>
          </div>
        ))}

        {/* Global Score Seal */}
        <div className="absolute bottom-4 right-4 border-2 border-white p-2 bg-black/80">
           <p className="text-[8px] font-black text-white uppercase leading-none mb-1">Score Geral</p>
           <p className={`text-2xl font-black italic leading-none ${health.overall > 80 ? 'text-green-500' : health.overall > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
             {Math.round(health.overall * 10) / 10}
           </p>
        </div>
      </CardContent>
    </Card>
  )
}
