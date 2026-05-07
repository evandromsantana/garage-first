import { DocumentationConfig } from "./types"

export function getArchitectureTemplate(config: DocumentationConfig): string {
  return `
# ${config.title}

## Descrição
${config.description}

## Versão
${config.version}

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
