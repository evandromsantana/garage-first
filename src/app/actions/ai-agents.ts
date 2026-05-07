'use server'

import { revalidatePath } from 'next/cache'

export async function runAgentAction(agentName: string) {
  const { agentManager } = await import('@/lib/agents')
  if (agentName === 'all') {
    await agentManager.runFullAnalysis()
  } else {
    await agentManager.runAgent(agentName)
  }
  revalidatePath('/agents')
}
