---
description: Workflow para criar componentes React
---

# Component Creation Workflow

## 1. Verificar Componente Existente

Cheque `src/components/ui/` antes de criar novo componente.

## 2. Usar shadcn (se disponível no registry)

// turbo

```bash
npx shadcn add <component-name>
```

## 3. Ou Criar Manualmente

- Criar em `src/components/` ou `src/components/ui/`
- Usar PascalCase para nome do arquivo
- Adicionar `'use client'` apenas se necessário
- Usar Tailwind para estilização
- Exportar como default ou named export

## 4. Padrão de Componente

```tsx
'use client' // se necessário

interface Props {
  // ...
}

export function ComponentName({ ... }: Props) {
  return (
    <div className="...">
      {/* ... */}
    </div>
  )
}
```
