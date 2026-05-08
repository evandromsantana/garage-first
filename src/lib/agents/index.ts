/**
 * Agents Index - Exporta todos os agentes especializados
 * Centraliza o acesso aos agentes de otimização
 */

import { performanceAgent, type PerformanceMetrics } from './performance-agent'
import { securityAgent, type SecurityMetrics, type SecurityRule } from './security-agent'
import { testingAgent, type TestCase, type TestResult, type TestSuite, type TestSummary } from './testing-agent'
import { documentationAgent, type ComponentDoc, type APIDoc, type DocumentationConfig } from './documentation-agent'
import { predictiveAgent } from './predictive-agent'
import { financialAgent } from './financial-agent'
import { wealthAgent } from './wealth-agent'

export { performanceAgent, type PerformanceMetrics }
export { securityAgent, type SecurityMetrics, type SecurityRule }
export { testingAgent, type TestCase, type TestResult, type TestSuite, type TestSummary }
export { documentationAgent, type ComponentDoc, type APIDoc, type DocumentationConfig }
export { predictiveAgent }
export { financialAgent }
export { wealthAgent }

/**
 * Agent Manager - Coordena todos os agentes
 * Provê interface unificada para otimização do projeto
 */

interface AgentMetrics {
  score?: number
  suggestions?: string[]
  passRate?: number
  [key: string]: any
}

interface AgentStatus {
  name: string
  active: boolean
  lastRun: Date | null
  metrics: AgentMetrics | string | null
}

class AgentManager {
  private agents: Map<string, unknown> = new Map()
  private status: Map<string, AgentStatus> = new Map()

  constructor() {
    this.initializeAgents()
  }

  private initializeAgents() {
    this.agents.set('performance', performanceAgent)
    this.agents.set('security', securityAgent)
    this.agents.set('testing', testingAgent)
    this.agents.set('documentation', documentationAgent)
    this.agents.set('predictive', predictiveAgent)
    this.agents.set('financial', financialAgent)
    this.agents.set('wealth', wealthAgent)

    // Inicializar status
    for (const [name] of this.agents) {
      this.status.set(name, {
        name,
        active: false,
        lastRun: null,
        metrics: null
      })
    }
  }

  // Executar análise completa do projeto
  async runFullAnalysis(data?: { 
    logs?: any[], 
    currentKm?: number, 
    rules?: any[],
    purchasePrice?: number,
    marketValue?: number
  }): Promise<{
    performance: unknown
    security: unknown
    testing: unknown
    documentation: unknown
    predictive: unknown
    financial: unknown
    wealth: unknown
  }> {
    const results: Record<string, unknown> = {}

    // Performance Analysis
    try {
      const pAgent = this.agents.get('performance') as typeof performanceAgent
      if (pAgent && pAgent.analyzePerformance) {
        results['performance'] = pAgent.analyzePerformance()
        this.updateStatus('performance', true, results['performance'] as Record<string, unknown>)
      }
    } catch (error) {
      console.error('Performance analysis failed:', error)
    }

    // Security Analysis
    try {
      const sAgent = this.agents.get('security') as typeof securityAgent
      if (sAgent && sAgent.analyzeSecurity) {
        results['security'] = sAgent.analyzeSecurity()
        this.updateStatus('security', true, results['security'] as Record<string, unknown>)
      }
    } catch (error) {
      console.error('Security analysis failed:', error)
    }

    // Testing Analysis
    try {
      const tAgent = this.agents.get('testing') as typeof testingAgent
      if (tAgent && tAgent.runAllTests) {
        const testResults = await tAgent.runAllTests()
        results['testing'] = testResults
        this.updateStatus('testing', true, testResults.summary as unknown as Record<string, unknown>)
      }
    } catch (error) {
      console.error('Testing analysis failed:', error)
    }

    // Predictive Analysis (Real Data)
    try {
      const predAgent = this.agents.get('predictive') as typeof predictiveAgent
      if (predAgent && predAgent.analyze) {
        results['predictive'] = predAgent.analyze(data?.logs || [], data?.currentKm || 0, data?.rules)
        this.updateStatus('predictive', true, results['predictive'] as Record<string, unknown>)
      }
    } catch (error) {
      console.error('Predictive analysis failed:', error)
    }

    // Financial Analysis (Real Data)
    try {
      const finAgent = this.agents.get('financial') as typeof financialAgent
      if (finAgent && finAgent.analyze) {
        results['financial'] = finAgent.analyze(data?.logs || [], data?.currentKm || 0)
        this.updateStatus('financial', true, results['financial'] as Record<string, unknown>)
      }
    } catch (error) {
      console.error('Financial analysis failed:', error)
    }

    // Wealth Analysis (Real Data)
    try {
      const wAgent = this.agents.get('wealth') as typeof wealthAgent
      if (wAgent && wAgent.analyze) {
        results['wealth'] = wAgent.analyze(
          data?.purchasePrice || 0,
          data?.marketValue || 0,
          data?.logs || []
        )
        this.updateStatus('wealth', true, results['wealth'] as Record<string, unknown>)
      }
    } catch (error) {
      console.error('Wealth analysis failed:', error)
    }

    return results as any
  }

  // Gerar documentação de componentes principais
  private generateComponentDocs() {
    // Em ambiente real, isso escanearia os arquivos de componentes
    return [
      {
        name: 'DashboardClient',
        description: 'Main dashboard component',
        props: [],
        usage: '<DashboardClient vehicle={vehicle} pending={pending} />',
        examples: []
      },
      {
        name: 'DashboardHeader',
        description: 'Dashboard header component',
        props: [],
        usage: '<DashboardHeader vehicle={vehicle} />',
        examples: []
      }
    ]
  }

  // Gerar documentação de APIs principais
  private generateAPIDocs() {
    // Em ambiente real, isso escanearia os arquivos de API
    return [
      {
        endpoint: '/api/auth/login',
        method: 'POST',
        description: 'User login endpoint',
        parameters: [],
        responses: [],
        example: 'fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })'
      }
    ]
  }

  // Atualizar status do agente
  private updateStatus(agentName: string, active: boolean, metrics: Record<string, unknown> | string | null) {
    const status = this.status.get(agentName)!
    status.active = active
    status.lastRun = new Date()
    status.metrics = metrics
  }

  // Obter status de todos os agentes
  getAgentsStatus(): AgentStatus[] {
    return Array.from(this.status.values())
  }

  // Executar agente específico
  async runAgent(agentName: string, data?: { 
    logs?: any[], 
    currentKm?: number, 
    rules?: any[],
    purchasePrice?: number,
    marketValue?: number
  }): Promise<unknown> {
    const agent = this.agents.get(agentName)
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`)
    }

    try {
      let result
      switch (agentName) {
        case 'performance':
          result = (agent as typeof performanceAgent).analyzePerformance()
          break
        case 'security':
          result = (agent as typeof securityAgent).analyzeSecurity()
          break
        case 'testing':
          result = await (agent as typeof testingAgent).runAllTests()
          break
        case 'documentation':
          result = { 
            components: this.generateComponentDocs(), 
            apis: this.generateAPIDocs() 
          }
          break
        case 'predictive':
          result = (agent as typeof predictiveAgent).analyze(
            data?.logs || [], 
            data?.currentKm || 0, 
            data?.rules
          )
          break
        case 'financial':
          result = (agent as typeof financialAgent).analyze(
            data?.logs || [], 
            data?.currentKm || 0
          )
          break
        case 'wealth':
          result = (agent as typeof wealthAgent).analyze(
            data?.purchasePrice || 0,
            data?.marketValue || 0,
            data?.logs || []
          )
          break
        default:
          throw new Error(`Unknown agent: ${agentName}`)
      }

      this.updateStatus(agentName, true, result as Record<string, unknown>)
      return result
    } catch (error) {
      console.error(`Agent ${agentName} failed:`, error)
      throw error
    }
  }

  // Gerar relatório completo
  generateReport(): string {
    const status = this.getAgentsStatus()
    
    let report = '# Garage Ninja - Agent Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`
    
    for (const agent of status) {
      report += `## ${agent.name} Agent\n\n`
      report += `- Status: ${agent.active ? '✅ Active' : '❌ Inactive'}\n`
      report += `- Last Run: ${agent.lastRun ? agent.lastRun.toISOString() : 'Never'}\n`
      
      if (agent.metrics && typeof agent.metrics === 'object') {
        const metrics = agent.metrics as AgentMetrics
        if (metrics.score !== undefined) {
          report += `- Score: ${metrics.score}/100\n`
        }
        if (metrics.suggestions) {
          report += `- Suggestions: ${metrics.suggestions.length}\n`
        }
        if (metrics.passRate !== undefined) {
          report += `- Pass Rate: ${metrics.passRate.toFixed(1)}%\n`
        }
      } else if (typeof agent.metrics === 'string') {
        report += `- Metrics: ${agent.metrics}\n`
      }
      
      report += '\n'
    }

    return report
  }

  // Limpar recursos
  cleanup() {
    for (const [_, agent] of this.agents) {
      const a = agent as { cleanup?: () => void }
      if (a.cleanup) {
        a.cleanup()
      }
    }
    this.agents.clear()
    this.status.clear()
  }
}

export const agentManager = new AgentManager()
export type { AgentStatus }
