export interface ServiceStep {
  text: string;
  torque?: string;
  tool?: string;
}

export interface ServiceGuide {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedTime: string;
  steps: ServiceStep[];
}

export const SERVICE_GUIDES: Record<string, ServiceGuide> = {
  oil_change: {
    title: "TROCA DE ÓLEO E FILTRO",
    difficulty: "EASY",
    estimatedTime: "30 min",
    steps: [
      { text: "Aquecer o motor por 3-5 minutos", tool: "N/A" },
      { text: "Remover o bujão de dreno", tool: "Chave 17mm", torque: "20 Nm" },
      { text: "Drenar óleo completamente", tool: "Bacia de dreno" },
      { text: "Remover filtro de óleo antigo", tool: "Chave de filtro" },
      { text: "Instalar novo filtro (lubrificar o-ring)", tool: "Mão", torque: "12 Nm" },
      { text: "Reinstalar bujão com arruela nova", tool: "Chave 17mm", torque: "20 Nm" },
      { text: "Abastecer com 1.9L de óleo 10W40", tool: "Funil" },
      { text: "Verificar nível e vazamentos", tool: "N/A" }
    ]
  },
  chain_adjustment: {
    title: "AJUSTE E LUBRIFICAÇÃO DE CORRENTE",
    difficulty: "MEDIUM",
    estimatedTime: "15 min",
    steps: [
      { text: "Limpar corrente com desengraxante", tool: "Escova" },
      { text: "Soltar porca do eixo traseiro", tool: "Chave 27mm", torque: "108 Nm" },
      { text: "Ajustar tensionadores (folga 25-35mm)", tool: "Chave 12mm" },
      { text: "Alinhar marcas em ambos os lados", tool: "N/A" },
      { text: "Apertar porca do eixo", tool: "Torquímetro", torque: "108 Nm" },
      { text: "Lubrificar elos internos", tool: "Spray" }
    ]
  },
  brake_pads: {
    title: "SUBSTITUIÇÃO DE PASTILHAS DIANTEIRAS",
    difficulty: "MEDIUM",
    estimatedTime: "40 min",
    steps: [
      { text: "Soltar parafusos da pinça", tool: "Allen 6mm", torque: "25 Nm" },
      { text: "Remover pinça do disco", tool: "N/A" },
      { text: "Remover pastilhas velhas", tool: "N/A" },
      { text: "Limpar pistões da pinça", tool: "Limpador de freio" },
      { text: "Recuar pistões cuidadosamente", tool: "N/A" },
      { text: "Instalar novas pastilhas", tool: "N/A" },
      { text: "Reinstalar pinça no garfo", tool: "Torquímetro", torque: "25 Nm" },
      { text: "Bombear o manete até dar pressão", tool: "N/A" }
    ]
  }
}
