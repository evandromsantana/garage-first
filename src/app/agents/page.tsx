import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Activity, Shield, FileText, TestTube, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { agentManager } from "@/lib/agents"
import { runAgentAction } from "@/app/actions"
import { PageHeader } from "@/components/page-header"

export default async function AgentsPage() {
  // Obter status atual dos agentes
  const agentsStatus = agentManager.getAgentsStatus()
  
  return (
    <div className="min-h-screen bg-background font-mono pb-24">
      <PageHeader title="Agentes IA" icon={<Bot className="h-6 w-6" />} backHref="/dashboard" />

      <main className="p-4 space-y-6">
        {/* Header Info */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardContent className="p-4">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-2 text-foreground" />
              <h2 className="text-xl font-black uppercase mb-2">Sistema de Agentes Especializados</h2>
              <p className="text-sm text-muted-foreground">
                Monitoramento inteligente e otimização automática do Garage Ninja
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agentsStatus.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>

        {/* Actions */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="font-black uppercase text-center">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form action={async () => { "use server"; await runAgentAction('all') }}>
                <Button type="submit" className="w-full h-14 font-black uppercase border-4 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[4px_4px_0_0_var(--foreground)]">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Análise Completa
                </Button>
              </form>
              <form action={async () => { "use server"; await runAgentAction('documentation') }}>
                <Button type="submit" className="w-full h-14 font-black uppercase border-4 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-none transition-none shadow-[4px_4px_0_0_var(--foreground)]">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="font-black uppercase text-center">
              Visão Geral do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-green-600">{agentsStatus.filter(a => a.active).length}</div>
                <div className="text-sm text-muted-foreground">Agentes Ativos</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">{agentsStatus.length}</div>
                <div className="text-sm text-muted-foreground">Total de Agentes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-600">100%</div>
                <div className="text-sm text-muted-foreground">Cobertura</div>
              </div>
              <div>
                <div className="text-2xl font-black text-orange-600">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoramento</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function AgentCard({ agent }: { agent: any }) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'performance': return <Activity className="h-6 w-6" />
      case 'security': return <Shield className="h-6 w-6" />
      case 'testing': return <TestTube className="h-6 w-6" />
      case 'documentation': return <FileText className="h-6 w-6" />
      case 'predictive': return <Bot className="h-6 w-6" />
      case 'financial': return <RefreshCw className="h-6 w-6" />
      default: return <Bot className="h-6 w-6" />
    }
  }

  const getStatusColor = (active: boolean) => {
    return active ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (active: boolean) => {
    return active ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />
  }

  return (
    <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="border-b-4 border-foreground pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon(agent.name)}
            <CardTitle className="font-black uppercase text-sm">
              {agent.name.charAt(0).toUpperCase() + agent.name.slice(1)} Agent
            </CardTitle>
          </div>
          <div className={`flex items-center gap-1 ${getStatusColor(agent.active)}`}>
            {getStatusIcon(agent.active)}
            <span className="text-xs font-bold">
              {agent.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={agent.active ? 'default' : 'destructive'} className="text-xs">
              {agent.active ? 'Operacional' : 'Parado'}
            </Badge>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Última Execução:</span>
            <span className="font-bold">
              {agent.lastRun ? new Date(agent.lastRun).toLocaleTimeString('pt-BR') : 'Nunca'}
            </span>
          </div>
        </div>
        
        {agent.metrics && (
          <div className="border-t-2 border-foreground/20 pt-3">
            <div className="text-xs font-bold mb-2">Métricas:</div>
            <div className="space-y-1">
              {agent.metrics.score !== undefined && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Score:</span>
                  <span className={`font-bold ${agent.metrics.score > 80 ? 'text-green-600' : agent.metrics.score > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {agent.metrics.score}/100
                  </span>
                </div>
              )}
              {agent.metrics.suggestions && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Sugestões:</span>
                  <span className="font-bold">{agent.metrics.suggestions.length}</span>
                </div>
              )}
              {agent.metrics.passRate !== undefined && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Pass Rate:</span>
                  <span className={`font-bold ${agent.metrics.passRate > 90 ? 'text-green-600' : agent.metrics.passRate > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {agent.metrics.passRate.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <form action={async () => { "use server"; await runAgentAction(agent.name) }}>
          <Button 
            type="submit"
            className="w-full h-10 text-xs font-black uppercase border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-none transition-none"
            size="sm"
          >
            Executar Agente
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
