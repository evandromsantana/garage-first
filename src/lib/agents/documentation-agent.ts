/**
 * Documentation Agent - Gera e mantém documentação automática
 * Orchestrates the documentation generation process.
 */

import { 
  DocumentationConfig, 
  ComponentDoc, 
  APIDoc 
} from "./documentation/types"

import { 
  extractPropsFromCode, 
  extractParametersFromCode, 
  extractResponsesFromCode 
} from "./documentation/extractors"

import { 
  generateUsageExample, 
  generateAPIExample, 
  generateComponentMarkdown, 
  generateAPIMarkdown 
} from "./documentation/formatters"

import { getArchitectureTemplate } from "./documentation/architecture-template"

class DocumentationAgent {
  private config: DocumentationConfig = {
    title: 'Garage Ninja Documentation',
    description: 'Sistema de gestão e procedência extrema para Kawasaki Ninja 400',
    version: '1.0.0',
    author: 'Garage Ninja Team'
  }

  // Gerar documentação de componente
  generateComponentDoc(componentName: string, componentCode: string): ComponentDoc {
    const props = extractPropsFromCode(componentCode)
    
    return {
      name: componentName,
      description: `Component ${componentName} for Garage Ninja application`,
      props,
      usage: generateUsageExample(componentName, props),
      examples: this.generateExamples(componentName)
    }
  }

  // Gerar exemplos estáticos (pode ser expandido no futuro)
  private generateExamples(componentName: string) {
    return [
      {
        title: 'Exemplo Básico',
        description: `Uso padrão do componente ${componentName}`,
        code: `<${componentName} />`
      }
    ]
  }

  // Gerar documentação de API
  generateAPIDoc(endpoint: string, method: string, handlerCode: string): APIDoc {
    const parameters = extractParametersFromCode(handlerCode)
    const responses = extractResponsesFromCode(handlerCode)
    
    return {
      endpoint,
      method,
      description: `${method} ${endpoint} endpoint`,
      parameters,
      responses,
      example: generateAPIExample(endpoint, method, parameters)
    }
  }

  // Gerar documentação de arquitetura
  generateArchitectureDoc(): string {
    return getArchitectureTemplate(this.config)
  }

  // Gerar documentação completa em Markdown
  generateFullDocumentation(components: ComponentDoc[], apis: APIDoc[]): string {
    let doc = this.generateArchitectureDoc()
    
    doc += '\n\n---\n\n# Componentes\n\n'
    for (const component of components) {
      doc += generateComponentMarkdown(component)
    }
    
    doc += '\n\n---\n\n# API Reference\n\n'
    for (const api of apis) {
      doc += generateAPIMarkdown(api)
    }
    
    return doc
  }

  // Salvar documentação em arquivo
  async saveDocumentation(content: string, filename: string): Promise<void> {
    // Em ambiente real, isso salvaria no sistema de arquivos usando fs ou similar
    console.log(`[Documentation] Saving ${filename}`)
    // console.log(content)
  }
}

export const documentationAgent = new DocumentationAgent()
export type { ComponentDoc, APIDoc, DocumentationConfig }
