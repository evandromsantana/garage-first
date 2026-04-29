/**
 * Agents Index - Exporta todos os agentes especializados
 * Centraliza o acesso aos agentes de otimização
 */

export { performanceAgent, type PerformanceMetrics } from './performance-agent'
export { securityAgent, type SecurityMetrics, type SecurityRule } from './security-agent'
export { testingAgent, type TestCase, type TestResult, type TestSuite, type TestSummary } from './testing-agent'
export { documentationAgent, type ComponentDoc, type APIDoc, type DocumentationConfig } from './documentation-agent'

/**
 * Agent Manager - Coordena todos os agentes
 * Provê interface unificada para otimização do projeto
 */

interface AgentStatus {
  name: string
  active: boolean
  lastRun: Date | null
  metrics: any
}

class AgentManager {
  private agents: Map<string, any> = new Map()
  private status: Map<string, AgentStatus> = new Map()

  constructor() {
    // Inicializar agentes de forma síncrona para evitar problemas
    this.initializeAgentsSync()
  }

  private initializeAgentsSync() {
    // Importar e registrar todos os agentes de forma síncrona
    try {
      // Import direto para compatibilidade no browser
      const { performanceAgent } = require('./performance-agent')
      this.agents.set('performance', performanceAgent)
      console.log('Performance agent loaded successfully')
    } catch (error) {
      console.error('Failed to load performance agent:', error)
      // Criar agente fallback
      this.agents.set('performance', {
        analyzePerformance: () => ({ suggestions: ['Performance agent not available'], metrics: {} })
      })
    }

    try {
      const { securityAgent } = require('./security-agent')
      this.agents.set('security', securityAgent)
      console.log('Security agent loaded successfully')
    } catch (error) {
      console.error('Failed to load security agent:', error)
      // Criar agente fallback
      this.agents.set('security', {
        analyzeSecurity: () => ({ suggestions: ['Security agent not available'], metrics: {} })
      })
    }

    try {
      const { testingAgent } = require('./testing-agent')
      this.agents.set('testing', testingAgent)
      console.log('Testing agent loaded successfully')
    } catch (error) {
      console.error('Failed to load testing agent:', error)
      // Criar agente fallback
      this.agents.set('testing', {
        runAllTests: () => ({ results: [], summary: { passed: 0, failed: 0 } })
      })
    }

    try {
      const { documentationAgent } = require('./documentation-agent')
      this.agents.set('documentation', documentationAgent)
      console.log('Documentation agent loaded successfully')
    } catch (error) {
      console.error('Failed to load documentation agent:', error)
      // Criar agente fallback
      this.agents.set('documentation', {
        generateFullDocumentation: () => '# Garage Ninja Documentation\n\nGenerated documentation placeholder.'
      })
    }

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
    performance: any
    security: any
    testing: any
    documentation: any
  }> {
    const results: any = {}

    // Performance Analysis
    try {
      const performanceAgent = this.agents.get('performance')
      if (performanceAgent && performanceAgent.analyzePerformance) {
        results.performance = performanceAgent.analyzePerformance()
        this.updateStatus('performance', true, results.performance)
      } else {
        throw new Error('Performance agent not available or missing analyzePerformance method')
      }
    } catch (error) {
      console.error('Performance analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.performance = { error: errorMessage, suggestions: ['Performance agent unavailable'] }
    }

    // Security Analysis
    try {
      const securityAgent = this.agents.get('security')
      if (securityAgent && securityAgent.analyzeSecurity) {
        results.security = securityAgent.analyzeSecurity()
        this.updateStatus('security', true, results.security)
      } else {
        throw new Error('Security agent not available or missing analyzeSecurity method')
      }
    } catch (error) {
      console.error('Security analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.security = { error: errorMessage, suggestions: ['Security agent unavailable'] }
    }

    // Testing Analysis
    try {
      const testingAgent = this.agents.get('testing')
      if (testingAgent && testingAgent.runAllTests) {
        const testResults = testingAgent.runAllTests()
        results.testing = testResults
        this.updateStatus('testing', true, testResults.summary)
      } else {
        throw new Error('Testing agent not available or missing runAllTests method')
      }
    } catch (error) {
      console.error('Testing analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.testing = { error: errorMessage, suggestions: ['Testing agent unavailable'] }
    }

    // Documentation Analysis
    try {
      const documentationAgent = this.agents.get('documentation')
      if (documentationAgent && documentationAgent.generateFullDocumentation) {
        const docs = documentationAgent.generateFullDocumentation([], [])
        results.documentation = { components: [], apis: [], documentation: docs }
        this.updateStatus('documentation', true, docs)
      } else {
        throw new Error('Documentation agent not available or missing generateFullDocumentation method')
      }
    } catch (error) {
      console.error('Documentation analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.documentation = { error: errorMessage, suggestions: ['Documentation agent unavailable'] }
    }

    return results
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
  private updateStatus(agentName: string, active: boolean, metrics: any) {
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
  async runAgent(agentName: string): Promise<any> {
    const agent = this.agents.get(agentName)
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`)
    }

    try {
      let result
      switch (agentName) {
        case 'performance':
          result = agent.analyzePerformance()
          break
        case 'security':
          result = agent.analyzeSecurity()
          break
        case 'testing':
          result = await agent.runAllTests()
          break
        case 'documentation':
          const components = this.generateComponentDocs()
          const apis = this.generateAPIDocs()
          result = { components, apis }
          break
        default:
          throw new Error(`Unknown agent: ${agentName}`)
      }

      this.updateStatus(agentName, true, result)
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
      
      if (agent.metrics) {
        if (agent.metrics.score !== undefined) {
          report += `- Score: ${agent.metrics.score}/100\n`
        }
        if (agent.metrics.suggestions) {
          report += `- Suggestions: ${agent.metrics.suggestions.length}\n`
        }
        if (agent.metrics.passRate !== undefined) {
          report += `- Pass Rate: ${agent.metrics.passRate.toFixed(1)}%\n`
        }
      }
      
      report += '\n'
    }

    return report
  }

  // Limpar recursos
  cleanup() {
    for (const [name, agent] of this.agents) {
      if (agent.cleanup) {
        agent.cleanup()
      }
    }
    this.agents.clear()
    this.status.clear()
  }
}

export const agentManager = new AgentManager()
export type { AgentStatus }
