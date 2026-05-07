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

export { performanceAgent, type PerformanceMetrics }
export { securityAgent, type SecurityMetrics, type SecurityRule }
export { testingAgent, type TestCase, type TestResult, type TestSuite, type TestSummary }
export { documentationAgent, type ComponentDoc, type APIDoc, type DocumentationConfig }
export { predictiveAgent }
export { financialAgent }

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
  async runFullAnalysis(): Promise<{
    performance: unknown
    security: unknown
    testing: unknown
    documentation: unknown
  }> {
    const results: Record<string, unknown> = {}

    // Performance Analysis
    try {
      const pAgent = this.agents.get('performance') as typeof performanceAgent
      if (pAgent && pAgent.analyzePerformance) {
        results['performance'] = pAgent.analyzePerformance()
        this.updateStatus('performance', true, results['performance'] as Record<string, unknown>)
      } else {
        throw new Error('Performance agent not available or missing analyzePerformance method')
      }
    } catch (error) {
      console.error('Performance analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results['performance'] = { error: errorMessage, suggestions: ['Performance agent unavailable'] }
    }

    // Security Analysis
    try {
      const sAgent = this.agents.get('security') as typeof securityAgent
      if (sAgent && sAgent.analyzeSecurity) {
        results['security'] = sAgent.analyzeSecurity()
        this.updateStatus('security', true, results['security'] as Record<string, unknown>)
      } else {
        throw new Error('Security agent not available or missing analyzeSecurity method')
      }
    } catch (error) {
      console.error('Security analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results['security'] = { error: errorMessage, suggestions: ['Security agent unavailable'] }
    }

    // Testing Analysis
    try {
      const tAgent = this.agents.get('testing') as typeof testingAgent
      if (tAgent && tAgent.runAllTests) {
        const testResults = await tAgent.runAllTests()
        results['testing'] = testResults
        this.updateStatus('testing', true, testResults.summary as unknown as Record<string, unknown>)
      } else {
        throw new Error('Testing agent not available or missing runAllTests method')
      }
    } catch (error) {
      console.error('Testing analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results['testing'] = { error: errorMessage, suggestions: ['Testing agent unavailable'] }
    }

    // Documentation Analysis
    try {
      const docAgent = this.agents.get('documentation') as typeof documentationAgent
      if (docAgent && docAgent.generateFullDocumentation) {
        const docs = docAgent.generateFullDocumentation([], [])
        results['documentation'] = { components: [], apis: [], documentation: docs }
        this.updateStatus('documentation', true, docs)
      } else {
        throw new Error('Documentation agent not available or missing generateFullDocumentation method')
      }
    } catch (error) {
      console.error('Documentation analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results['documentation'] = { error: errorMessage, suggestions: ['Documentation agent unavailable'] }
    }

    return results as {
      performance: unknown
      security: unknown
      testing: unknown
      documentation: unknown
    }
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
  async runAgent(agentName: string): Promise<unknown> {
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
          // Em uso real, passaria dados dinâmicos
          result = (agent as typeof predictiveAgent).analyze([], 0)
          break
        case 'financial':
          result = (agent as typeof financialAgent).analyze([], 0)
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
