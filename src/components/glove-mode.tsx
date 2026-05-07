"use client"

import { useState } from "react"
import { toast } from "sonner"
import { haptics } from "@/lib/haptics"
import { ServiceGuide } from "@/lib/constants/guides"
import { ninjaVoice } from "@/lib/voice-assistant"
import { TechnicalSpec } from "@/types"

import { MainMenu } from "./glove-mode/main-menu"
import { GuidesList } from "./glove-mode/guides-list"
import { GuideDetail } from "./glove-mode/guide-detail"
import { SpecsViewer } from "./glove-mode/specs-viewer"
import { ChecklistView } from "./glove-mode/checklist-view"

interface GloveModeProps {
  vehicleId: string
  specs: TechnicalSpec[]
  onClose: () => void
  onQuickLog: (type: string) => void
}

const CHECKLISTS: Record<string, { title: string; items: string[] }> = {
  PREVENTIVA: {
    title: "CHECKLIST PREVENTIVA",
    items: [
      "LIMPAR E LUBRIFICAR CORRENTE",
      "CALIBRAR PNEUS (D:28 / T:32)",
      "CHECAR NÍVEL DE ÓLEO",
      "CHECAR FLUIDO DE FREIO",
      "VERIFICAR LUZES / SETAS"
    ]
  },
  LAVAGEM: {
    title: "LAVAGEM TÁTICA",
    items: [
      "DESENGRAXAR RELAÇÃO E CORRENTE",
      "LAVAR CARENAGENS",
      "SECAR MOTO COMPLETAMENTE",
      "LUBRIFICAR CORRENTE (MOTUL C4)",
      "REVITALIZAR PLÁSTICOS NEGROS"
    ]
  }
}

export function GloveMode({ vehicleId, specs, onClose, onQuickLog }: GloveModeProps) {
  const [checklistActive, setChecklistActive] = useState<string | null>(null)
  const [selectedGuide, setSelectedGuide] = useState<ServiceGuide | null>(null)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [showTorques, setShowTorques] = useState(false)
  const [showGuidesList, setShowGuidesList] = useState(false)

  const handleToggleCheck = (item: string) => {
    haptics.light()
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }))
  }

  const handleCompleteService = () => {
    haptics.success()
    const title = selectedGuide?.title ?? CHECKLISTS[checklistActive ?? ""]?.title ?? "Serviço"
    toast.success(`${title} Concluído!`)
    ninjaVoice.announceSuccess(title)
    onQuickLog(title)
    setChecklistActive(null)
    setSelectedGuide(null)
    setCheckedItems({})
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      haptics.success()
      toast.success("Foto anexada ao serviço atual!")
    }
  }

  // View: Guide Detail
  if (selectedGuide) {
    return (
      <GuideDetail 
        guide={selectedGuide}
        checkedItems={checkedItems}
        onToggleCheck={handleToggleCheck}
        onComplete={handleCompleteService}
        onBack={() => { setSelectedGuide(null); setCheckedItems({}); }}
      />
    )
  }

  // View: Guides List
  if (showGuidesList) {
    return (
      <GuidesList 
        onSelectGuide={(guide) => { setSelectedGuide(guide); setShowGuidesList(false); }}
        onClose={() => setShowGuidesList(false)}
      />
    )
  }

  // View: Torques / Specs
  if (showTorques) {
    return (
      <SpecsViewer 
        vehicleId={vehicleId}
        specs={specs}
        onClose={() => setShowTorques(false)}
      />
    )
  }

  // View: Checklist
  if (checklistActive && CHECKLISTS[checklistActive]) {
    const activeData = CHECKLISTS[checklistActive]
    return (
      <ChecklistView 
        title={activeData.title}
        items={activeData.items}
        checkedItems={checkedItems}
        onToggleCheck={handleToggleCheck}
        onComplete={handleCompleteService}
        onCancel={() => { setChecklistActive(null); setCheckedItems({}); }}
      />
    )
  }

  // View: Main Menu
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-mono">
      <MainMenu 
        onShowGuides={() => setShowGuidesList(true)}
        onShowChecklist={(type) => setChecklistActive(type)}
        onShowTorques={() => setShowTorques(true)}
        onPhotoCapture={handlePhotoCapture}
        onClose={onClose}
      />
    </div>
  )
}
