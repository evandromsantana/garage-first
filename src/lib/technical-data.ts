export interface OEMPart {
  name: string
  code: string
  spec: string
}

export const OEM_PARTS: OEMPart[] = [
  { name: "Filtro de Óleo", code: "16097-0008", spec: "Substituir a cada 10.000km" },
  { name: "Vela de Ignição", code: "LMAR9G (NGK)", spec: "Substituir a cada 12.000km" },
  { name: "Filtro de Ar", code: "11013-0768", spec: "Inspecionar a cada 5.000km" },
  { name: "Pastilha Dianteira", code: "43082-0128", spec: "Checagem visual" },
  { name: "Pastilha Traseira", code: "43082-0142", spec: "Checagem visual" },
]

export interface FluidCapacity {
  sys: string
  cap: string
  note: string
}

export const FLUID_CAPACITIES: FluidCapacity[] = [
  { sys: "Óleo do Motor", cap: "2.0 Litros", note: "10W40 Sintético (C/ Troca de Filtro)" },
  { sys: "Arrefecimento", cap: "1.3 Litros", note: "Fluido OAT (Base Etilenoglicol)" },
  { sys: "Freios", cap: "Até a Marca", note: "Fluido DOT 4 (Sangrar a cada 2 anos)" },
  { sys: "Suspensão", cap: "310ml (por bengala)", note: "Óleo 10W Fork Oil" },
]

export interface DiagnosticCode {
  error: string
  desc: string
}

export const DIAGNOSTIC_CODES: DiagnosticCode[] = [
  { error: "Erro 11", desc: "Sensor do Acelerador (Main Throttle Sensor) falhando." },
  { error: "Erro 12", desc: "Sensor de Pressão de Ar de Admissão. Checar vácuo." },
  { error: "Erro 21", desc: "Sensor do Virabrequim. Fio quebrado ou sensor sujo." },
  { error: "Erro 31", desc: "Sensor de Inclinação. Moto detectou queda. Reiniciar painel." },
  { error: "Erro 62", desc: "Válvula Sub-Aceleradora. Checar atuador do corpo de injeção." },
]
