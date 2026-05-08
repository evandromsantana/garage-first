"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Camera, Scan, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { createWorker } from 'tesseract.js'

export function ScannerOCR({ onScanResult }: { onScanResult: (text: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const openCamera = async () => {
    try {
      setIsOpen(true)
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Câmera indisponível. Este navegador não suporta a API de câmera ou você não está usando HTTPS/localhost.")
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido ao acessar câmera")
      setIsOpen(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setStream(null)
    setIsOpen(false)
  }

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext('2d')
    if (!context) return
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    setIsScanning(true)
    setProgress(0)
    
    try {
      toast.info("Iniciando motor de reconhecimento ótico...")
      
      const worker = await createWorker('por', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })
      
      const { data: { text } } = await worker.recognize(canvas.toDataURL('image/png'))
      await worker.terminate()
      
      const result = text.trim()
      
      if (result) {
        onScanResult(result)
        toast.success("Texto extraído com sucesso!")
        stopCamera()
      } else {
        toast.warning("Nenhum texto detectado na imagem.")
      }
    } catch (error) {
      console.error("OCR Error:", error)
      toast.error("Falha ao analisar a imagem.")
    } finally {
      setIsScanning(false)
    }
  }

  if (!isOpen) {
    return (
      <Button 
        type="button" 
        variant="outline" 
        onClick={openCamera}
        className="w-full h-14 border-2 border-foreground border-dashed bg-muted/30 font-black uppercase text-sm"
      >
        <Scan className="h-5 w-5 mr-2" />
        Escanear Código da Peça (OCR)
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col font-mono">
      <div className="p-4 border-b-4 border-foreground flex justify-between items-center">
        <h2 className="text-xl font-black uppercase flex items-center gap-2">
          <Camera className="h-6 w-6" /> Escaner Ninja
        </h2>
        <Button variant="ghost" size="icon" onClick={stopCamera}>
          <X className="h-8 w-8" />
        </Button>
      </div>

      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Viewfinder overlay */}
        <div className="absolute inset-0 border-[40px] border-black/50">
          <div className="w-full h-full border-4 border-white/80 border-dashed relative">
            <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] uppercase font-bold p-1">
              Alinhe o código de barras ou texto da peça
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="p-6 border-t-4 border-foreground bg-background">
        <Button 
          onClick={captureAndScan} 
          disabled={isScanning}
          className="w-full h-20 text-xl font-black uppercase border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]"
        >
          {isScanning ? (
            <><Loader2 className="h-6 w-6 mr-2 animate-spin" /> PROCESSANDO OCR...</>
          ) : (
            <><Scan className="h-6 w-6 mr-2" /> CAPTURAR E ANALISAR</>
          )}
        </Button>
      </div>

      <div className="absolute top-20 right-4 z-50">
         {/* Fallback para tirar foto pelo input nativo caso o video não rode bem */}
         <label className="bg-foreground text-background font-bold text-[10px] uppercase px-3 py-2 cursor-pointer border-2 border-background">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              onChange={async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0]
                  setIsScanning(true)
                  setProgress(0)
                  toast.info("Analisando foto da peça...")
                  
                  try {
                    const worker = await createWorker('por')
                    const imageUrl = URL.createObjectURL(file)
                    const { data: { text } } = await worker.recognize(imageUrl)
                    await worker.terminate()
                    
                    if (text.trim()) {
                      onScanResult(text.trim())
                      toast.success("Texto extraído!")
                      stopCamera()
                    } else {
                      toast.warning("Nenhum texto detectado.")
                    }
                  } catch (error) {
                    toast.error("Erro ao processar foto.")
                  } finally {
                    setIsScanning(false)
                  }
                }
              }}
            />
           TIRAR FOTO
         </label>
      </div>
    </div>
  )
}
