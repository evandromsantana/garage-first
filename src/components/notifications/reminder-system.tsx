"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle, Clock, Plus, Settings } from "lucide-react"
import { useEffect, useState } from "react"

interface Reminder {
  id: string
  title: string
  description: string
  dueDate: Date
  type: "maintenance" | "inspection" | "custom"
  recurring: boolean
  frequency?: "daily" | "weekly" | "monthly" | "yearly"
  isActive: boolean
  completedAt?: Date | undefined
}

interface ReminderSystemProps {
  vehicleKm: number
  maintenanceLogs: Array<{
    id: string
    type: string
    description: string
    kmAtService: number
    createdAt: Date
  }>
}

export function ReminderSystem({ vehicleKm, maintenanceLogs }: ReminderSystemProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showAddReminder, setShowAddReminder] = useState(false)

  useEffect(() => {
    // Generate automatic reminders based on maintenance patterns
    const autoReminders: Reminder[] = []
    
    // Oil change reminder (every 5000km or 6 months)
    const lastOilChange = maintenanceLogs
      .filter(log => log.description.toLowerCase().includes("óleo"))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    
    if (lastOilChange) {
      const kmSinceOil = vehicleKm - lastOilChange.kmAtService
      const kmUntilNext = Math.max(0, 5000 - kmSinceOil)
      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() + 6)
      
      autoReminders.push({
        id: "oil-change",
        title: "Troca de Óleo",
        description: `Próxima troca em ${kmUntilNext}km ou ${dueDate.toLocaleDateString('pt-BR')}`,
        dueDate,
        type: "maintenance",
        recurring: true,
        frequency: "monthly",
        isActive: kmUntilNext <= 1000,
        completedAt: kmUntilNext <= 0 ? new Date() : undefined
      })
    }

    // Chain inspection reminder (every 10000km)
    const kmSinceChain = vehicleKm % 10000
    const kmUntilChain = 10000 - kmSinceChain
    
    autoReminders.push({
      id: "chain-inspection",
      title: "Inspeção da Corrente",
      description: `Verificar tensão e lubrificação em ${kmUntilChain}km`,
      dueDate: new Date(Date.now() + (kmUntilChain * 100)),
      type: "inspection",
      recurring: true,
      frequency: "monthly",
      isActive: kmUntilChain <= 500,
      completedAt: kmUntilChain <= 0 ? new Date() : undefined
    })

    // Tire pressure reminder (weekly)
    autoReminders.push({
      id: "tire-pressure",
      title: "Pressão dos Pneus",
      description: "Verificar pressão semanalmente",
      dueDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      type: "inspection",
      recurring: true,
      frequency: "weekly",
      isActive: true
    })

    // Brake pads reminder (every 15000km)
    const kmSinceBrakes = vehicleKm % 15000
    const kmUntilBrakes = 15000 - kmSinceBrakes
    
    autoReminders.push({
      id: "brake-pads",
      title: "Pastilhas de Freio",
      description: `Inspecionar desgaste em ${kmUntilBrakes}km`,
      dueDate: new Date(Date.now() + (kmUntilBrakes * 100)),
      type: "maintenance",
      recurring: false,
      isActive: kmUntilBrakes <= 2000,
      completedAt: kmUntilBrakes <= 0 ? new Date() : undefined
    })

    setReminders(autoReminders)
  }, [vehicleKm, maintenanceLogs])

  const activeReminders = reminders.filter(r => r.isActive && !r.completedAt)
  const overdueReminders = reminders.filter(r => r.isActive && r.dueDate < new Date() && !r.completedAt)
  const upcomingReminders = reminders.filter(r => r.isActive && r.dueDate >= new Date() && !r.completedAt)

  const completeReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completedAt: new Date(), isActive: false }
        : reminder
    ))
  }

  const snoozeReminder = (id: string, days: number) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, dueDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000)) }
        : reminder
    ))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance": return "bg-red-100 text-red-800 border-red-600"
      case "inspection": return "bg-blue-100 text-blue-800 border-blue-600"
      default: return "bg-gray-100 text-gray-800 border-gray-600"
    }
  }

  const getFrequencyLabel = (frequency?: string) => {
    switch (frequency) {
      case "daily": return "Diário"
      case "weekly": return "Semanal"
      case "monthly": return "Mensal"
      case "yearly": return "Anual"
      default: return ""
    }
  }

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
          <Bell className="h-5 w-5" />
          Sistema de Lembretes
          {activeReminders.length > 0 && (
            <Badge variant="outline" className="border-2 border-foreground rounded-none font-black">
              {activeReminders.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Overdue Reminders */}
        {overdueReminders.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase text-red-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              ATRASADOS ({overdueReminders.length})
            </h4>
            {overdueReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="p-3 bg-red-50 border-2 border-red-600 rounded"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold">{reminder.title}</span>
                      <Badge variant="outline" className={`text-[10px] rounded-none border font-black ${getTypeColor(reminder.type)}`}>
                        {reminder.type}
                      </Badge>
                      {reminder.recurring && (
                        <Badge variant="outline" className="text-[10px] rounded-none border border-dashed border-foreground">
                          {getFrequencyLabel(reminder.frequency)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-red-700 mb-2">{reminder.description}</p>
                    <p className="text-xs text-red-600 font-bold">
                      Venceu: {reminder.dueDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => snoozeReminder(reminder.id, 7)}
                      className="h-8 px-2 text-xs"
                    >
                      +7d
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => completeReminder(reminder.id)}
                      className="h-8 px-2 text-xs bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase">Próximos Lembretes</h4>
            {upcomingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="p-3 border-2 border-foreground/20 rounded"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold">{reminder.title}</span>
                      <Badge variant="outline" className={`text-[10px] rounded-none border font-black ${getTypeColor(reminder.type)}`}>
                        {reminder.type}
                      </Badge>
                      {reminder.recurring && (
                        <Badge variant="outline" className="text-[10px] rounded-none border border-dashed border-foreground">
                          {getFrequencyLabel(reminder.frequency)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{reminder.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Vence: {reminder.dueDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => snoozeReminder(reminder.id, 7)}
                      className="h-8 px-2 text-xs"
                    >
                      Adiar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => completeReminder(reminder.id)}
                      className="h-8 px-2 text-xs"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Reminders */}
        {reminders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold uppercase">Nenhum lembrete ativo</p>
            <p className="text-xs">Os lembretes aparecerão automaticamente</p>
          </div>
        )}

        {/* Add Custom Reminder Button */}
        <div className="pt-3 border-t-2 border-muted">
          <Button
            variant="outline"
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="w-full h-12 border-2 border-dashed border-foreground rounded-none font-black uppercase"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Lembrete Personalizado
          </Button>
        </div>

        {/* Settings */}
        <div className="flex justify-between items-center pt-2 border-t-2 border-muted">
          <span className="text-xs text-muted-foreground">
            {reminders.filter(r => r.isActive).length} lembretes ativos
          </span>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Configurar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
