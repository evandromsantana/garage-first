"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, Minus, Search, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib"

interface PriceEntry {
  id: string
  partName: string
  supplier: string
  price: number
  date: Date
  isOriginal: boolean
  notes?: string
}

interface PriceTrackerProps {
  expenses: Array<{
    itemName: string
    itemCost: number
    isOriginalPart: boolean
    createdAt: Date
  }>
}

export function PriceTracker({ expenses }: PriceTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [priceHistory, setPriceHistory] = useState<PriceEntry[]>([])

  // Generate price history from expenses
  const priceAnalysis = useMemo(() => {
    const partPrices = new Map<string, PriceEntry[]>()
    
    expenses.forEach(expense => {
      const partName = expense.itemName.toLowerCase()
      if (!partPrices.has(partName)) {
        partPrices.set(partName, [])
      }
      
      partPrices.get(partName)?.push({
        id: `${expense.createdAt.getTime()}-${expense.itemName}`,
        partName: expense.itemName,
        supplier: "Histórico",
        price: expense.itemCost,
        date: expense.createdAt,
        isOriginal: expense.isOriginalPart,
        notes: "Registro automático"
      })
    })

    // Add manual price entries
    priceHistory.forEach(entry => {
      const partName = entry.partName.toLowerCase()
      if (!partPrices.has(partName)) {
        partPrices.set(partName, [])
      }
      partPrices.get(partName)?.push(entry)
    })

    // Calculate statistics for each part
    const analysis = Array.from(partPrices.entries()).map(([partName, entries]) => {
      const sortedEntries = entries.sort((a, b) => b.date.getTime() - a.date.getTime())
      const prices = sortedEntries.map(e => e.price)
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const latestPrice = sortedEntries[0]?.price || 0
      const previousPrice = sortedEntries[1]?.price || latestPrice
      const priceChange = latestPrice - previousPrice
      const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0

      return {
        partName,
        entries: sortedEntries,
        avgPrice,
        minPrice,
        maxPrice,
        latestPrice,
        priceChange,
        priceChangePercent,
        supplierCount: new Set(sortedEntries.map(e => e.supplier)).size
      }
    })

    return analysis.sort((a, b) => b.latestPrice - a.latestPrice)
  }, [expenses, priceHistory])

  const filteredAnalysis = useMemo(() => {
    if (!searchTerm) return priceAnalysis
    return priceAnalysis.filter(item => 
      item.partName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [priceAnalysis, searchTerm])

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 5) return <TrendingUp className="h-4 w-4 text-red-600" />
    if (changePercent < -5) return <TrendingDown className="h-4 w-4 text-green-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (changePercent: number) => {
    if (changePercent > 5) return "text-red-600"
    if (changePercent < -5) return "text-green-600"
    return "text-gray-600"
  }

  const getSavings = (avgPrice: number, minPrice: number) => {
    return ((avgPrice - minPrice) / avgPrice) * 100
  }

  return (
    <Card className="border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
      <CardHeader className="pb-3 border-b-4 border-foreground">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
          <TrendingUp className="h-5 w-5" />
          Comparador de Preços
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Search and Add */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar peça..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-foreground rounded-none h-10 font-bold"
            />
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-10 px-4 border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-none font-bold uppercase"
          >
            <Plus className="h-4 w-4 mr-1" />
            Cotação
          </Button>
        </div>

        {/* Add Price Form */}
        {showAddForm && (
          <div className="p-4 bg-muted border-2 border-dashed border-foreground rounded">
            <h4 className="text-sm font-bold uppercase mb-3">Adicionar Cotação</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Peça" className="border-2 border-foreground rounded-none h-8 text-sm" />
              <Input placeholder="Fornecedor" className="border-2 border-foreground rounded-none h-8 text-sm" />
              <Input type="number" placeholder="Preço" className="border-2 border-foreground rounded-none h-8 text-sm" />
              <Button className="h-8 text-xs font-bold uppercase">Adicionar</Button>
            </div>
          </div>
        )}

        {/* Price Analysis */}
        <div className="space-y-3">
          {filteredAnalysis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold uppercase">Nenhuma peça encontrada</p>
              <p className="text-xs">Registre manutenções para ver comparações</p>
            </div>
          ) : (
            filteredAnalysis.map((item) => (
              <div key={item.partName} className="border-2 border-foreground/20 rounded p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold uppercase">{item.partName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] rounded-none border">
                        {item.supplierCount} fornecedores
                      </Badge>
                      {item.entries[0]?.isOriginal && (
                        <Badge variant="outline" className="text-[10px] rounded-none border border-blue-600 text-blue-800">
                          OEM
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black">{formatCurrency(item.latestPrice)}</div>
                    <div className="flex items-center gap-1 text-xs">
                      {getTrendIcon(item.priceChangePercent)}
                      <span className={getTrendColor(item.priceChangePercent)}>
                        {item.priceChangePercent > 0 ? '+' : ''}{item.priceChangePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="text-center p-2 bg-green-50 border border-green-600 rounded">
                    <div className="font-bold text-green-800">Mínimo</div>
                    <div>{formatCurrency(item.minPrice)}</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 border border-blue-600 rounded">
                    <div className="font-bold text-blue-800">Média</div>
                    <div>{formatCurrency(item.avgPrice)}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 border border-red-600 rounded">
                    <div className="font-bold text-red-800">Máximo</div>
                    <div>{formatCurrency(item.maxPrice)}</div>
                  </div>
                </div>

                {/* Savings Potential */}
                {getSavings(item.avgPrice, item.minPrice) > 10 && (
                  <div className="p-2 bg-green-100 border border-green-600 rounded text-xs">
                    <span className="font-bold text-green-800">
                      💰 Economia potencial: {getSavings(item.avgPrice, item.minPrice).toFixed(1)}%
                    </span>
                  </div>
                )}

                {/* Recent Entries */}
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-muted-foreground">Histórico Recente:</div>
                  {item.entries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center text-xs p-1 border-b border-foreground/10">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.supplier}</span>
                        {entry.isOriginal && (
                          <Badge variant="outline" className="text-[8px] px-1 rounded-none border border-blue-600 text-blue-800">
                            OEM
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{formatCurrency(entry.price)}</span>
                        <span className="text-muted-foreground">
                          {entry.date.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredAnalysis.length > 0 && (
          <div className="pt-3 border-t-2 border-muted">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="font-black text-lg">{filteredAnalysis.length}</div>
                <div className="text-muted-foreground">Peças rastreadas</div>
              </div>
              <div className="text-center">
                <div className="font-black text-lg">
                  {formatCurrency(
                    filteredAnalysis.reduce((sum, item) => sum + item.latestPrice, 0)
                  )}
                </div>
                <div className="text-muted-foreground">Valor total atual</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-10 text-xs font-bold uppercase border-2 border-foreground rounded-none">
            Exportar Planilha
          </Button>
          <Button variant="outline" className="flex-1 h-10 text-xs font-bold uppercase border-2 border-foreground rounded-none">
            Alertas de Preço
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
