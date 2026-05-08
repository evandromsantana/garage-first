'use client'

import { Button } from '@/components/ui/button'
import { parseReceiptText, type ParsedReceipt } from '@/lib/ocr-parser'
import { Camera, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { createWorker } from 'tesseract.js'

interface ReceiptScannerProps {
  onScanComplete: (data: ParsedReceipt) => void
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    toast.info("Iniciando reconhecimento ótico...")

    try {
      const worker = await createWorker('por', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })

      const imageUrl = URL.createObjectURL(file)
      const { data: { text } } = await worker.recognize(imageUrl)
      await worker.terminate()

      console.log('OCR Result:', text)
      const parsedData = parseReceiptText(text)
      
      if (parsedData.totalCost > 0) {
        toast.success(`Nota detectada: R$ ${parsedData.totalCost.toFixed(2)}`)
        onScanComplete(parsedData)
      } else {
        toast.warning("Texto extraído, mas não detectamos valores financeiros claros.")
        onScanComplete(parsedData)
      }
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error("Falha ao processar imagem")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      
      <Button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="kindle-button w-full h-24 flex flex-col gap-2 bg-foreground text-background"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-[10px] font-black uppercase">Processando... {progress}%</span>
          </>
        ) : (
          <>
            <Camera className="h-8 w-8" />
            <span className="text-[10px] font-black uppercase">Escanear Nota / Recibo</span>
          </>
        )}
      </Button>

      {isProcessing && (
        <div className="mt-2 w-full bg-muted h-2 border-2 border-foreground overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
