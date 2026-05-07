"use client"

import { ScannerOCR } from "@/components/scanner-ocr"
import { Button } from "@/components/ui/button"
import { PackagePlus } from "lucide-react"
import { useState } from "react"

export function PartsClientActions() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)

  return (
    <div className="space-y-4 mb-8">
      {scannedResult ? (
        <div className="p-4 border-4 border-foreground bg-foreground text-background">
          <p className="text-xs font-bold uppercase mb-1 text-muted">Peça Escaneada via IA:</p>
          <p className="text-xl font-black">{scannedResult}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 rounded-none border-2 border-background text-foreground hover:bg-background/20" onClick={() => setScannedResult(null)}>
              Limpar
            </Button>
            <Button className="flex-1 rounded-none border-2 border-background bg-background text-foreground hover:bg-background/90 font-bold uppercase">
              <PackagePlus className="w-4 h-4 mr-2" /> 
              Adicionar Estoque
            </Button>
          </div>
        </div>
      ) : (
        <ScannerOCR onScanResult={(text) => setScannedResult(text)} />
      )}
    </div>
  )
}
