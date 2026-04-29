/**
 * Documentation Agent - Gera e mantém documentação automática
 * Cria: API docs, component docs, architecture docs
 */

interface DocumentationConfig {
  title: string
  description: string
  version: string
  author: string
}

interface ComponentDoc {
  name: string
  description: string
  props: PropDoc[]
  usage: string
  examples: ExampleDoc[]
}

interface PropDoc {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

interface ExampleDoc {
  title: string
  description: string
  code: string
}

interface APIDoc {
  endpoint: string
  method: string
  description: string
  parameters: ParameterDoc[]
  responses: ResponseDoc[]
  example: string
}

interface ParameterDoc {
  name: string
  type: string
  required: boolean
  description: string
  location: 'query' | 'body' | 'path' | 'header'
}

interface ResponseDoc {
  statusCode: number
  description: string
  schema?: string
}

class DocumentationAgent {
  private config: DocumentationConfig = {
    title: 'Garage Ninja Documentation',
    description: 'Sistema de gestão e procedência extrema para Kawasaki Ninja 400',
    version: '1.0.0',
    author: 'Garage Ninja Team'
  }

  // Gerar documentação de componente
  generateComponentDoc(componentName: string, componentCode: string): ComponentDoc {
    // Extrair props do código (simplificado)
    const props = this.extractPropsFromCode(componentCode)
    
    return {
      name: componentName,
      description: `Component ${componentName} for Garage Ninja application`,
      props,
      usage: this.generateUsageExample(componentName, props),
      examples: this.generateExamples(componentName)
    }
  }

  // Extrair props do código do componente
  private extractPropsFromCode(code: string): PropDoc[] {
    const props: PropDoc[] = []
    
    // Regex para encontrar interface de props
    const interfaceMatch = code.match(/interface\s+(\w+Props)\s*{([^}]+)}/)
    if (interfaceMatch) {
      const propsText = interfaceMatch[2] || ""
      const propMatches = propsText.matchAll(/(\w+)(\?)?:\s*([^;]+);/g)
      
      for (const match of propMatches) {
        const [, name, optional, type] = match
        if (!name || !type) continue

        props.push({
          name,
          type: type.trim(),
          required: !optional,
          description: `The ${name} prop`
        })
      }
    }
    
    return props
  }

  // Gerar exemplo de uso
  private generateUsageExample(componentName: string, props: PropDoc[]): string {
    const requiredProps = props.filter(p => p.required)
    const propsString = requiredProps.map(p => `${p.name}={}`).join('\n    ')
    
    return `
import { ${componentName} } from '@/components/${componentName}'

export default function Example() {
  return (
    <${componentName}
      ${propsString}
    />
  )
}
    `.trim()
  }

  // Gerar exemplos do componente
  private generateExamples(componentName: string): ExampleDoc[] {
    return [
      {
        title: 'Basic Usage',
        description: `Basic example of ${componentName} usage`,
        code: this.generateUsageExample(componentName, [])
      },
      {
        title: 'Advanced Usage',
        description: `Advanced example with all props`,
        code: `
import { ${componentName} } from '@/components/${componentName}'

export default function AdvancedExample() {
  return (
    <${componentName}
      // Add all available props here
      variant="default"
      size="medium"
      disabled={false}
    />
  )
}
        `.trim()
      }
    ]
  }

  // Gerar documentação de API
  generateAPIDoc(endpoint: string, method: string, handlerCode: string): APIDoc {
    const parameters = this.extractParametersFromCode(handlerCode)
    const responses = this.extractResponsesFromCode(handlerCode)
    
    return {
      endpoint,
      method,
      description: `${method} ${endpoint} endpoint`,
      parameters,
      responses,
      example: this.generateAPIExample(endpoint, method, parameters)
    }
  }

  // Extrair parâmetros do código do handler
  private extractParametersFromCode(code: string): ParameterDoc[] {
    const parameters: ParameterDoc[] = []
    
    // Regex para encontrar parâmetros da função
    const functionMatch = code.match(/async function\s+\w+\s*\(([^)]+)\)/)
    if (functionMatch) {
      const paramsText = functionMatch[1] || ""
      const paramMatches = paramsText.matchAll(/(\w+)(\?)?:\s*([^,]+)/g)
      
      for (const match of paramMatches) {
        const [, name, optional, type] = match
        if (!name || !type) continue
        
        parameters.push({
          name,
          type: type.trim(),
          required: !optional,
          description: `Parameter ${name}`,
          location: 'body'
        })
      }
    }
    
    return parameters
  }

  // Extrair respostas do código do handler
  private extractResponsesFromCode(code: string): ResponseDoc[] {
    const responses: ResponseDoc[] = []
    
    // Procurar por retornos JSON
    if (code.includes('NextResponse.json(')) {
      responses.push({
        statusCode: 200,
        description: 'Successful response',
        schema: 'JSON response object'
      })
    }
    
    if (code.includes('NextResponse.redirect(')) {
      responses.push({
        statusCode: 307,
        description: 'Redirect response'
      })
    }
    
    return responses
  }

  // Gerar exemplo de API
  private generateAPIExample(endpoint: string, method: string, parameters: ParameterDoc[]): string {
    const bodyParams = parameters.filter(p => p.location === 'body')
    const queryParams = parameters.filter(p => p.location === 'query')
    
    let example = ''
    
    if (method === 'GET') {
      example += `fetch('/api${endpoint}${queryParams.length > 0 ? '?' + queryParams.map(p => `${p.name}=value`).join('&') : ''}`
    } else {
      const body = bodyParams.length > 0 
        ? bodyParams.map(p => `"${p.name}": value`).join(',\n    ')
        : ''
      
      example += `fetch('/api${endpoint}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
${body}
  }),
})`
    }
    
    return example + '\n  .then(response => response.json())\n  .then(data => console.log(data))'
  }

  // Gerar documentação de arquitetura
  generateArchitectureDoc(): string {
    return `
# ${this.config.title}

## Descrição
${this.config.description}

## Versão
${this.config.version}

## Estrutura do Projeto

### Diretórios Principais
- \`/src/app\` - Páginas e rotas Next.js
- \`/src/components\` - Componentes React
- \`/src/lib\` - Utilitários e configurações
- \`/src/hooks\` - Hooks React personalizados
- \`/src/types\` - Definições TypeScript

### Arquitetura

#### Frontend
- **Framework**: Next.js 16.2.4 com Turbopack
- **UI**: TailwindCSS com shadcn/ui
- **Estado**: React hooks e server actions
- **Estilo**: Font estilo Kindle (Merriweather)

#### Backend
- **Banco**: SQLite com Prisma ORM
- **Autenticação**: JWT com HTTP-only cookies
- **API**: Next.js API routes
- **Validação**: Zod schemas

#### Segurança
- **Autenticação**: Baseada em sessão JWT
- **Autorização**: Middleware de roteamento
- **Input Validation**: Sanitização e regras de segurança
- **Rate Limiting**: Prevenção de brute force

### Fluxo de Autenticação

1. Usuário faz login → \`/auth/login\`
2. Server valida credenciais
3. JWT token gerado e armazenado em cookie
4. Middleware verifica token em rotas protegidas
5. Usuário acessa recursos baseado em permissões

### Estrutura de Dados

#### User
- id: UUID
- email: string (unique)
- password: string (hashed)
- name: string
- createdAt: DateTime
- updatedAt: DateTime

#### Vehicle
- id: UUID
- model: string
- year: number
- currentKm: number
- userId: UUID (foreign key)
- createdAt: DateTime
- updatedAt: DateTime

#### MaintenanceLog
- id: UUID
- vehicleId: UUID
- type: MaintenanceType
- description: string
- kmAtService: number
- cost: number?
- status: MaintenanceStatus
- createdAt: DateTime
- updatedAt: DateTime

## Componentes Principais

### Dashboard
- **DashboardClient**: Componente principal do dashboard
- **DashboardHeader**: Cabeçalho com navegação
- **DashboardMetrics**: Métricas do veículo
- **DashboardNavigation**: Navegação do dashboard

### Autenticação
- **LoginPage**: Página de login
- **RegisterPage**: Página de registro
- **ForgotPasswordPage**: Recuperação de senha

### Manutenção
- **NewMaintenanceForm**: Formulário de nova manutenção
- **MaintenanceDetailPage**: Detalhes da manutenção

## Agentes Especializados

### Performance Agent
Monitora e otimiza:
- Tempo de carregamento
- Renderização de componentes
- Uso de memória
- Performance de API

### Security Agent
Monitora e protege:
- Validação de inputs
- Prevenção de XSS/SQL Injection
- Rate limiting
- Autenticação e autorização

### Testing Agent
Automatiza testes:
- Unit tests para componentes
- Integration tests para APIs
- E2E tests para fluxos críticos
- Geração automática de testes

### Documentation Agent
Gera e mantém:
- Documentação de componentes
- Documentação de APIs
- Documentação de arquitetura
- Exemplos de uso

## Melhores Práticas

### Código
- Usar TypeScript estrito
- Seguir convenções de nomenclatura
- Componentes pequenos e reutilizáveis
- Hooks personalizados para lógica compartilhada

### Performance
- Lazy loading de componentes
- Memoização onde aplicável
- Otimização de bundle
- Cache de dados

### Segurança
- Validação de todos os inputs
- Sanitização de dados
- Uso de HTTPS em produção
- Segredos em environment variables

## Deploy

### Ambiente de Desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

### Build de Produção
\`\`\`bash
npm run build
npm start
\`\`\`

### Variáveis de Ambiente
- \`DATABASE_URL\`: URL do banco SQLite
- \`JWT_SECRET\`: Segredo para JWT tokens
- \`NODE_ENV\`: Ambiente (development/production)

## Contribuição

1. Fork do repositório
2. Criar branch para feature
3. Implementar mudanças com testes
4. Submeter pull request

## Licença

MIT License - ver arquivo LICENSE para detalhes
    `.trim()
  }

  // Gerar documentação completa em Markdown
  generateFullDocumentation(components: ComponentDoc[], apis: APIDoc[]): string {
    let doc = this.generateArchitectureDoc()
    
    doc += '\n\n---\n\n# Componentes\n\n'
    
    for (const component of components) {
      doc += this.generateComponentMarkdown(component)
    }
    
    doc += '\n\n---\n\n# API Reference\n\n'
    
    for (const api of apis) {
      doc += this.generateAPIMarkdown(api)
    }
    
    return doc
  }

  // Gerar Markdown para componente
  private generateComponentMarkdown(component: ComponentDoc): string {
    let md = `## ${component.name}\n\n`
    md += `${component.description}\n\n`
    
    if (component.props.length > 0) {
      md += '### Props\n\n'
      md += '| Nome | Tipo | Required | Descrição |\n'
      md += '|------|------|----------|------------|\n'
      
      for (const prop of component.props) {
        md += `| ${prop.name} | \`${prop.type}\` | ${prop.required ? 'Sim' : 'Não'} | ${prop.description} |\n`
      }
      md += '\n'
    }
    
    md += '### Uso\n\n'
    md += '```tsx\n'
    md += component.usage
    md += '\n```\n\n'
    
    for (const example of component.examples) {
      md += `### ${example.title}\n\n`
      md += `${example.description}\n\n`
      md += '```tsx\n'
      md += example.code
      md += '\n```\n\n'
    }
    
    return md
  }

  // Gerar Markdown para API
  private generateAPIMarkdown(api: APIDoc): string {
    let md = `## ${api.method} ${api.endpoint}\n\n`
    md += `${api.description}\n\n`
    
    if (api.parameters.length > 0) {
      md += '### Parâmetros\n\n'
      md += '| Nome | Tipo | Required | Localização | Descrição |\n'
      md += '|------|------|----------|-------------|------------|\n'
      
      for (const param of api.parameters) {
        md += `| ${param.name} | \`${param.type}\` | ${param.required ? 'Sim' : 'Não'} | ${param.location} | ${param.description} |\n`
      }
      md += '\n'
    }
    
    md += '### Respostas\n\n'
    for (const response of api.responses) {
      md += `#### ${response.statusCode} - ${response.description}\n`
      if (response.schema) {
        md += `\`\`\`\n${response.schema}\n\`\`\`\n\n`
      }
    }
    
    md += '### Exemplo\n\n'
    md += '```javascript\n'
    md += api.example
    md += '\n```\n\n'
    
    return md
  }

  // Salvar documentação em arquivo
  async saveDocumentation(content: string, filename: string): Promise<void> {
    // Em ambiente real, isso salvaria no sistema de arquivos
    console.log(`[Documentation] Saving ${filename}`)
    console.log(content)
  }
}

export const documentationAgent = new DocumentationAgent()
export type { ComponentDoc, APIDoc, DocumentationConfig }
