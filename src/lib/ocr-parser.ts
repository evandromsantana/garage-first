/**
 * OCR Parser - Extrai dados financeiros de textos brutos (OCR)
 * Focado em padrões de notas fiscais brasileiras (NFC-e, NFS-e)
 */

export interface ParsedReceipt {
  description: string
  totalCost: number
  date?: string | undefined
  parts?: { name: string, cost: number }[] | undefined
}

export function parseReceiptText(text: string): ParsedReceipt {
  const lines = text.split('\n')
  let totalCost = 0
  let description = "Manutenção via Scanner"
  let date = new Date().toISOString().split('T')[0]
  const parts: { name: string, cost: number }[] = []

  // 1. Procurar por TOTAL (Valor total da nota)
  const totalRegex = /(?:TOTAL|VALOR TOTAL|PAGO|VALOR).*?(\d+[,.]\d{2})/i
  const totalMatch = text.match(totalRegex)
  if (totalMatch && totalMatch[1]) {
    totalCost = parseFloat(totalMatch[1].replace(',', '.'))
  }

  // 2. Procurar por Data
  const dateRegex = /(\d{2})[\/-](\d{2})[\/-](\d{2,4})/
  const dateMatch = text.match(dateRegex)
  if (dateMatch && dateMatch[1] && dateMatch[2] && dateMatch[3]) {
    const [_, day, month, year] = dateMatch
    const fullYear = year.length === 2 ? `20${year}` : year
    date = `${fullYear}-${month}-${day}`
  }

  // 3. Tentar extrair itens (Peças)
  // Padrões: Nome da peça seguido de valor
  lines.forEach(line => {
    const itemRegex = /([A-Z\s]{3,})\s+(\d+[,.]\d{2})/i
    const match = line.match(itemRegex)
    if (match && match[1] && match[2] && !line.toLowerCase().includes('total')) {
      const name = match[1].trim()
      const cost = parseFloat(match[2].replace(',', '.'))
      if (cost > 0 && cost < totalCost) {
        parts.push({ name, cost })
      }
    }
  })

  // Se extraímos peças, a descrição pode ser o nome da primeira
  if (parts.length > 0) {
    description = parts.map(p => p.name).join(', ').substring(0, 50) + "..."
  }

  return {
    description,
    totalCost,
    date,
    parts
  }
}
