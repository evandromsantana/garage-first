"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MaintenanceLogSummary } from "@/types"
import { calculateTotalSpent } from "@/lib/utils"
import { MAINTENANCE_TYPE_LABELS } from "@/lib/constants"

function formatTooltipValue(value: unknown): [string, string] | string {
  if (typeof value === 'number') {
    return [`R$ ${value.toLocaleString('pt-BR')}`, '']
  }
  return String(value ?? '')
}

interface ExpenseChartProps {
  maintenanceLogs: MaintenanceLogSummary[]
}

const COLORS = {
  PREVENTIVE: "var(--foreground)",
  CORRECTIVE: "hsl(var(--muted-foreground))",
  UPGRADE: "hsl(var(--border))"
}

type MonthlyData = { month: string; total: number }
type TypeData = { name: string; value: number; type: string }

function calculateMonthlyData(logs: MaintenanceLogSummary[]): MonthlyData[] {
  if (!logs || logs.length === 0) return []
  
  return logs.reduce<MonthlyData[]>((acc, log) => {
    const month = new Date(log.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    const total = calculateTotalSpent([log])

    const existing = acc.find(item => item.month === month)
    if (existing) {
      existing.total += total
    } else {
      acc.push({ month, total })
    }
    return acc
  }, [])
}

function calculateTypeData(logs: MaintenanceLogSummary[]): TypeData[] {
  if (!logs || logs.length === 0) return []
  
  const typeData: TypeData[] = [
    { name: MAINTENANCE_TYPE_LABELS.PREVENTIVE, value: 0, type: 'PREVENTIVE' },
    { name: MAINTENANCE_TYPE_LABELS.CORRECTIVE, value: 0, type: 'CORRECTIVE' },
    { name: MAINTENANCE_TYPE_LABELS.UPGRADE, value: 0, type: 'UPGRADE' },
  ]

  logs.forEach(log => {
    const total = calculateTotalSpent([log])
    const typeItem = typeData.find(t => t.type === log.type)
    if (typeItem) typeItem.value += total
  })

  return typeData.filter(d => d.value > 0)
}

export function ExpenseChart({ maintenanceLogs }: ExpenseChartProps) {
  const [mounted, setMounted] = useState(false)
  
  // Memoize data calculations to prevent re-renders
  const monthlyData = useMemo(() => calculateMonthlyData(maintenanceLogs), [maintenanceLogs])
  const pieData = useMemo(() => calculateTypeData(maintenanceLogs), [maintenanceLogs])
  
  // Memoize formatter to prevent re-renders
  const tickFormatter = useCallback((v: number) => `R$${v}`, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!maintenanceLogs || maintenanceLogs.length === 0) {
    return (
      <Card className="rounded-none border-4 border-foreground shadow-[2px_2px_0_0_var(--foreground)]">
        <CardContent className="p-8 text-center text-muted-foreground font-bold uppercase tracking-widest">
          Nenhum gasto registrado
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 font-mono">
      <Card className="rounded-none border-4 border-foreground shadow-none">
        <CardHeader className="pb-2 border-b-4 border-foreground">
          <CardTitle className="text-sm font-black uppercase tracking-widest">Evolução de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 min-h-[192px] w-full">
            {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={tickFormatter} />
                <Tooltip
                  formatter={formatTooltipValue}
                  contentStyle={{ backgroundColor: 'var(--background)', border: '2px solid var(--foreground)', borderRadius: '0px', color: 'var(--foreground)', boxShadow: 'none' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  cursor={{fill: 'currentColor', opacity: 0.1}}
                />
                <Bar dataKey="total" fill="var(--foreground)" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-muted animate-pulse" />
            )}
          </div>
        </CardContent>
      </Card>

      {pieData.length > 0 && (
        <Card className="rounded-none border-4 border-foreground shadow-none">
          <CardHeader className="pb-2 border-b-4 border-foreground">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Distribuição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 min-h-[192px] w-full">
              {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry: TypeData, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={formatTooltipValue}
                    contentStyle={{ backgroundColor: 'var(--background)', border: '2px solid var(--foreground)', borderRadius: '0px', color: 'var(--foreground)', boxShadow: 'none' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-muted animate-pulse" />
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((item: TypeData) => (
                <div key={item.type} className="flex items-center gap-2 border-2 border-foreground px-2 py-1 bg-background">
                  <div 
                    className="w-3 h-3 border-2 border-foreground" 
                    style={{ backgroundColor: COLORS[item.type as keyof typeof COLORS] }}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
