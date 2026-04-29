"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Zap, Award, Wrench, Calendar, DollarSign } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: Date
  progress: number
  maxProgress: number
  category: "maintenance" | "cost" | "time" | "quality"
}

interface AchievementsProps {
  maintenanceLogs: Array<{
    id: string
    type: string
    createdAt: Date
    expenses: Array<{
      itemCost: number
      isOriginalPart?: boolean
    }>
  }>
  totalSpent: number
  currentKm: number
}

export function Achievements({ maintenanceLogs, totalSpent, currentKm }: AchievementsProps) {
  const achievements: Achievement[] = useMemo(() => {
    const newAchievements: Achievement[] = [
      // Maintenance Achievements
      {
        id: "first_maintenance",
        title: "Primeiro Serviço",
        description: "Registrar sua primeira manutenção",
        icon: <Wrench className="h-6 w-6" />,
        unlocked: maintenanceLogs.length >= 1,
        progress: Math.min(maintenanceLogs.length, 1),
        maxProgress: 1,
        category: "maintenance"
      },
      {
        id: "maintenance_master",
        title: "Mestre da Manutenção",
        description: "Registrar 10 manutenções",
        icon: <Trophy className="h-6 w-6" />,
        unlocked: maintenanceLogs.length >= 10,
        progress: Math.min(maintenanceLogs.length, 10),
        maxProgress: 10,
        category: "maintenance"
      },
      {
        id: "preventive_pro",
        title: "Preventiva Pro",
        description: "80% de manutenções preventivas",
        icon: <Star className="h-6 w-6" />,
        unlocked: maintenanceLogs.length > 0 && 
          (maintenanceLogs.filter(log => log.type === 'PREVENTIVE').length / maintenanceLogs.length) >= 0.8,
        progress: maintenanceLogs.length > 0 
          ? Math.round((maintenanceLogs.filter(log => log.type === 'PREVENTIVE').length / maintenanceLogs.length) * 100)
          : 0,
        maxProgress: 100,
        category: "quality"
      },

      // Cost Achievements
      {
        id: "budget_master",
        title: "Mestre do Orçamento",
        description: "Manter média abaixo de R$200 por serviço",
        icon: <DollarSign className="h-6 w-6" />,
        unlocked: maintenanceLogs.length > 0 && 
          (totalSpent / maintenanceLogs.length) <= 200,
        progress: maintenanceLogs.length > 0 
          ? Math.max(0, 100 - Math.round(((totalSpent / maintenanceLogs.length) / 200) * 100))
          : 0,
        maxProgress: 100,
        category: "cost"
      },
      {
        id: "big_spender",
        title: "Investidor Série",
        description: "Investir mais de R$5000 no veículo",
        icon: <Target className="h-6 w-6" />,
        unlocked: totalSpent >= 5000,
        progress: Math.min((totalSpent / 5000) * 100, 100),
        maxProgress: 100,
        category: "cost"
      },

      // Time Achievements
      {
        id: "early_bird",
        title: "Madrugador",
        description: "Registrar manutenção antes das 6h",
        icon: <Calendar className="h-6 w-6" />,
        unlocked: maintenanceLogs.some(log => 
          new Date(log.createdAt).getHours() < 6
        ),
        progress: maintenanceLogs.some(log => 
          new Date(log.createdAt).getHours() < 6
        ) ? 100 : 0,
        maxProgress: 100,
        category: "time"
      },
      {
        id: "consistency_king",
        title: "Rei da Consistência",
        description: "Manutenções por 3 meses consecutivos",
        icon: <Award className="h-6 w-6" />,
        unlocked: false, // Complex calculation needed
        progress: 0,
        maxProgress: 100,
        category: "time"
      },

      // Quality Achievements
      {
        id: "oem_lover",
        title: "Fã OEM",
        description: "90% de peças originais",
        icon: <Zap className="h-6 w-6" />,
        unlocked: false, // Calculate based on parts
        progress: 0,
        maxProgress: 100,
        category: "quality"
      },
      {
        id: "milestone_master",
        title: "Mestre de Marcos",
        description: "Alcançar 20000km",
        icon: <Trophy className="h-6 w-6" />,
        unlocked: currentKm >= 20000,
        progress: Math.min((currentKm / 20000) * 100, 100),
        maxProgress: 100,
        category: "maintenance"
      }
    ]

    // Calculate consistency achievement
    if (maintenanceLogs.length >= 3) {
      const sortedLogs = [...maintenanceLogs].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      
      let consecutiveMonths = 0
      let currentMonth = new Date().getMonth()
      let currentYear = new Date().getFullYear()
      
      for (const log of sortedLogs.reverse()) {
        const logDate = new Date(log.createdAt)
        if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
          consecutiveMonths++
          currentMonth--
          if (currentMonth < 0) {
            currentMonth = 11
            currentYear--
          }
        } else {
          break
        }
      }
      
      const consistencyAchievement = newAchievements.find(a => a.id === "consistency_king")
      if (consistencyAchievement) {
        consistencyAchievement.unlocked = consecutiveMonths >= 3
        consistencyAchievement.progress = Math.min((consecutiveMonths / 3) * 100, 100)
      }
    }

    // Calculate OEM achievement
    const allParts = maintenanceLogs.flatMap(log => log.expenses)
    if (allParts.length > 0) {
      const oemParts = allParts.filter((part) => part.isOriginalPart).length
      const oemPercentage = (oemParts / allParts.length) * 100
      
      const oemAchievement = newAchievements.find(a => a.id === "oem_lover")
      if (oemAchievement) {
        oemAchievement.unlocked = oemPercentage >= 90
        oemAchievement.progress = oemPercentage
      }
    }

    return newAchievements
  }, [maintenanceLogs, totalSpent, currentKm])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "maintenance": return "bg-blue-100 text-blue-800 border-blue-600"
      case "cost": return "bg-green-100 text-green-800 border-green-600"
      case "time": return "bg-purple-100 text-purple-800 border-purple-600"
      case "quality": return "bg-orange-100 text-orange-800 border-orange-600"
      default: return "bg-gray-100 text-gray-800 border-gray-600"
    }
  }

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
          <Trophy className="h-5 w-5" />
          Conquistas
          <Badge variant="outline" className="border-2 border-foreground rounded-none font-black">
            {unlockedCount}/{totalCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Progress Overview */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold uppercase">Progresso Total</span>
            <span className="text-sm font-black">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-muted border-2 border-foreground rounded-none h-4">
            <div 
              className={`h-full bg-linear-to-r from-foreground to-muted-foreground transition-all duration-500`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border-2 rounded p-4 transition-all duration-300 ${
                achievement.unlocked
                  ? "border-foreground bg-card shadow-[2px_2px_0_0_var(--foreground)]"
                  : "border-dashed border-foreground/30 bg-muted opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded border-2 ${
                  achievement.unlocked
                    ? "bg-foreground text-background"
                    : "bg-muted border-foreground/30"
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold uppercase">{achievement.title}</h3>
                    <Badge variant="outline" className={`text-[10px] rounded-none border font-black ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase">Progresso</span>
                      <span className="text-xs font-black">
                        {achievement.progress}/{achievement.maxProgress}
                        {achievement.maxProgress === 100 && "%"}
                      </span>
                    </div>
                    <div className="w-full bg-background border border-foreground/30 rounded-none h-2">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          achievement.unlocked ? "bg-foreground" : "bg-muted-foreground"
                        }`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>

                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Desbloqueado: {achievement.unlockedAt.toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        {completionPercentage === 100 && (
          <div className="mt-6 p-4 bg-foreground text-background border-2 border-foreground text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-black uppercase">🎉 Todas as Conquistas Desbloqueadas!</p>
            <p className="text-xs mt-1">Você é um verdadeiro mestre da manutenção!</p>
          </div>
        )}

        {completionPercentage >= 50 && completionPercentage < 100 && (
          <div className="mt-6 p-4 bg-muted border-2 border-dashed border-foreground text-center">
            <p className="text-sm font-bold uppercase">Continue assim!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Você já desbloqueou {unlockedCount} de {totalCount} conquistas
            </p>
          </div>
        )}

        {completionPercentage < 50 && completionPercentage > 0 && (
          <div className="mt-6 p-4 bg-muted border-2 border-dashed border-foreground text-center">
            <p className="text-sm font-bold uppercase">Bom começo!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Continue registrando manutenções para desbloquear mais conquistas
            </p>
          </div>
        )}

        {completionPercentage === 0 && (
          <div className="mt-6 p-4 bg-muted border-2 border-dashed border-foreground text-center">
            <p className="text-sm font-bold uppercase">Comece sua jornada!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Registre sua primeira manutenção para desbloquear conquistas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
