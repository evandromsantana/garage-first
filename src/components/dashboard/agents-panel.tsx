"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Activity, Shield, FileText, TestTube, RefreshCw, AlertTriangle, TrendingUp } from "lucide-react"
import { agentManager, type AgentStatus } from "@/lib/agents"

interface AgentsPanelProps {
  className?: string
}

export function AgentsPanel({ className }: AgentsPanelProps) {
  const [agents, setAgents] = useState<AgentStatus[]>(() => agentManager.getAgentsStatus())
  const [isRunning, setIsRunning] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    setLastUpdate(new Date())
  }, [])

  const runFullAnalysis = async () => {
    setIsRunning(true)
    try {
      const results = await agentManager.runFullAnalysis()
      
      // Atualizar status dos agentes
      const updatedStatus = agentManager.getAgentsStatus()
      setAgents(updatedStatus)
      setLastUpdate(new Date())
      
      console.log('Análise completa:', results)
    } catch (error) {
      console.error('Erro na análise:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'performance': return <Activity className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'testing': return <TestTube className="h-4 w-4" />
      case 'documentation': return <FileText className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-600'
    if (score > 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const activeAgents = agents.filter(a => a.active).length
  const totalAgents = agents.length
  const healthScore = agents.length > 0 
    ? Math.round((activeAgents / totalAgents) * 100)
    : 0

  return (
    <Card className={`bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)] ${className}`}>
      <CardHeader className="border-b-4 border-foreground pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-black uppercase flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agentes IA
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={healthScore > 80 ? 'default' : 'destructive'} className="text-xs">
              {healthScore}% Saúde
            </Badge>
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleTimeString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-black text-green-600">{activeAgents}</div>
            <div className="text-xs text-muted-foreground">Ativos</div>
          </div>
          <div>
            <div className="text-lg font-black text-blue-600">{totalAgents}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-lg font-black text-purple-600">{healthScore}%</div>
            <div className="text-xs text-muted-foreground">Saúde</div>
          </div>
        </div>

        {/* Agents List */}
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.name} className="flex items-center justify-between p-2 border-2 border-foreground/20 rounded">
              <div className="flex items-center gap-2">
                {getIcon(agent.name)}
                <span className="text-sm font-bold capitalize">{agent.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {typeof agent.metrics === 'object' && agent.metrics?.score !== undefined && (
                  <span className={`text-xs font-bold ${getScoreColor(agent.metrics.score)}`}>
                    {agent.metrics.score}/100
                  </span>
                )}
                <Badge variant={agent.active ? 'default' : 'destructive'} className="text-xs">
                  {agent.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {agents.some(a => typeof a.metrics === 'object' && (a.metrics?.score ?? 100) < 60) && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border-2 border-red-600 rounded">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-bold text-red-600">
              Alguns agentes precisam de atenção
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            onClick={runFullAnalysis}
            disabled={isRunning}
            className="w-full h-10 text-xs font-black uppercase border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-none transition-none disabled:opacity-50"
            size="sm"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Executar Análise Completa
              </>
            )}
          </Button>
          
          <Button 
            className="w-full h-8 text-xs font-bold uppercase border-2 border-foreground/50 bg-background text-foreground hover:bg-foreground/10 hover:text-foreground rounded-none transition-none"
            variant="outline"
            size="sm"
          >
            <FileText className="h-3 w-3 mr-1" />
            Ver Relatório Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
