"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Smartphone } from "lucide-react"
import { useEffect, useState } from "react"

export function AppPreferences() {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [offlineMode, _setOfflineMode] = useState(true)

  useEffect(() => {
    const savedVoice = localStorage.getItem('ninja-voice-enabled')
    if (savedVoice !== null) setVoiceEnabled(savedVoice === 'true')
      
    const savedNotif = localStorage.getItem('ninja-notifications')
    if (savedNotif !== null) setNotifications(savedNotif === 'true')
  }, [])

  const handleVoiceToggle = (checked: boolean) => {
    setVoiceEnabled(checked)
    localStorage.setItem('ninja-voice-enabled', checked.toString())
  }

  const handleNotifToggle = (checked: boolean) => {
    setNotifications(checked)
    localStorage.setItem('ninja-notifications', checked.toString())
  }

  return (
    <Card className="kindle-card">
      <CardHeader className="pb-4 border-b-4 border-foreground">
        <CardTitle className="font-black uppercase text-xl italic flex items-center gap-2">
          <Smartphone className="h-6 w-6" />
          Configurações da Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y-2 divide-foreground">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <Label className="text-lg font-black uppercase italic leading-none">Agente de Voz</Label>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-none">
              Microfone flutuante auxiliar
            </p>
          </div>
          <Switch 
            checked={voiceEnabled}
            onCheckedChange={handleVoiceToggle}
            className="data-[state=checked]:bg-foreground border-2 border-foreground" 
          />
        </div>
        
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <Label className="text-lg font-black uppercase italic leading-none">Notificações Push</Label>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-none">
              Alertas de manutenção preventiva
            </p>
          </div>
          <Switch 
            checked={notifications}
            onCheckedChange={handleNotifToggle}
            className="data-[state=checked]:bg-foreground border-2 border-foreground" 
          />
        </div>

        <div className="flex items-center justify-between p-6 opacity-30">
          <div className="space-y-1">
            <Label className="text-lg font-black uppercase italic leading-none">Modo Offline (PWA)</Label>
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
              Sincronização em segundo plano
            </p>
          </div>
          <Switch 
            checked={offlineMode}
            disabled
            className="data-[state=checked]:bg-foreground border-2 border-foreground" 
          />
        </div>
      </CardContent>

    </Card>
  )
}
