import { ComponentDoc, APIDoc } from "./types"

export function generateUsageExample(componentName: string, props: { name: string; type: string }[]): string {
  const propsString = props
    .filter(p => !p.name.includes('className'))
    .slice(0, 3)
    .map(p => `${p.name}={value}`)
    .join(' ')
  
  return `<${componentName} ${propsString} />`
}

export function generateAPIExample(endpoint: string, method: string, parameters: { name: string; location: string }[]): string {
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

export function generateComponentMarkdown(component: ComponentDoc): string {
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

export function generateAPIMarkdown(api: APIDoc): string {
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
