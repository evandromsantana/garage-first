export interface DocumentationConfig {
  title: string
  description: string
  version: string
  author: string
}

export interface ComponentDoc {
  name: string
  description: string
  props: PropDoc[]
  usage: string
  examples: ExampleDoc[]
}

export interface PropDoc {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

export interface ExampleDoc {
  title: string
  description: string
  code: string
}

export interface APIDoc {
  endpoint: string
  method: string
  description: string
  parameters: ParameterDoc[]
  responses: ResponseDoc[]
  example: string
}

export interface ParameterDoc {
  name: string
  type: string
  required: boolean
  description: string
  location: 'query' | 'body' | 'path' | 'header'
}

export interface ResponseDoc {
  statusCode: number
  description: string
  schema?: string
}
