'use server'

import { revalidatePath } from 'next/cache'

export async function runAgentAction(agentName: string) {
  const { agentManager } = await import('@/lib/agents')
  const { loadOrCreateVehicle } = await import('./vehicle')
  const { getVehicleWithData } = await import('./maintenance')
  const { getMaintenanceRules } = await import('./maintenance-rules')
  
  const vehicleBase = await loadOrCreateVehicle()
  const vehicle = await getVehicleWithData(vehicleBase.id)
  const rules = await getMaintenanceRules(vehicleBase.id)

  if (!vehicle) return

  const data = {
    logs: vehicle.maintenanceLogs,
    currentKm: vehicle.currentKm,
    rules: rules,
    purchasePrice: vehicle.purchasePrice || 0,
    marketValue: vehicle.currentMarketValue || 0
  }

  if (agentName === 'all') {
    await agentManager.runFullAnalysis(data)
  } else {
    await agentManager.runAgent(agentName, data)
  }
  revalidatePath('/agents')
}
