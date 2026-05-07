import { PropDoc, ParameterDoc, ResponseDoc } from "./types"

export function extractPropsFromCode(code: string): PropDoc[] {
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

export function extractParametersFromCode(code: string): ParameterDoc[] {
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

export function extractResponsesFromCode(code: string): ResponseDoc[] {
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
