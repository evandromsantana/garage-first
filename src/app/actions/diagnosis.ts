'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY'] || "")

export async function diagnoseSymptom(query: string) {
  if (!process.env['GEMINI_API_KEY']) {
    // Fallback para quando não há chave de API - heurística melhorada
    return fallbackDiagnosis(query)
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Você é um mecânico especialista em Kawasaki Ninja 400.
      Analise o seguinte sintoma relatado pelo usuário: "${query}"
      
      Retorne APENAS um objeto JSON válido (sem markdown, sem blocos de código) com:
      - likelyCause: Causa mais provável em poucas palavras e caixa alta.
      - severity: "low", "medium" ou "high".
      - recommendation: Recomendação técnica curta e direta em caixa alta.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Limpar o texto para garantir que seja um JSON válido
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim()
    return JSON.parse(cleanJson)
  } catch (error) {
    console.error("Gemini Diagnosis Error:", error)
    return fallbackDiagnosis(query)
  }
}

function fallbackDiagnosis(query: string) {
  const q = query.toLowerCase()
  if (q.includes("barulho") || q.includes("metal") || q.includes("batendo")) {
    return {
      likelyCause: "ANOMALIA MECÂNICA: CABEÇOTE / VALVULÁRIO",
      severity: "medium",
      recommendation: "REQUISITADO: INSPEÇÃO DE FOLGA DE VÁLVULAS. TORQUE PADRÃO: 12NM."
    }
  } else if (q.includes("pneu") || q.includes("instável") || q.includes("vibra")) {
    return {
      likelyCause: "INSTABILIDADE DINÂMICA: RODAGEM",
      severity: "low",
      recommendation: "REQUISITADO: VERIFICAR TWI (DESGASTE) E REALIZAR BALANCEAMENTO ESTÁTICO."
    }
  } else if (q.includes("liga") || q.includes("partida") || q.includes("bateria")) {
    return {
      likelyCause: "FALHA ELÉTRICA CRÍTICA: SISTEMA DE CARGA",
      severity: "high",
      recommendation: "REQUISITADO: TESTE DE ESTATOR E RETIFICADOR. VOLTAGEM EM REPOUSO > 12.6V."
    }
  }
  return {
    likelyCause: "ANOMALIA TÉCNICA NÃO CATALOGADA",
    severity: "medium",
    recommendation: "REQUISITADO: VARREDURA OBD2 COMPLETA E CHECAGEM DE CÓDIGOS DE ERRO ATIVOS."
  }
}
