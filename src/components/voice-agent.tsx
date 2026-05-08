"use client"

import { Button } from '@/components/ui/button'
import { useGloveMode } from '@/contexts/glove-mode'
import { Loader2, Mic, MicOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

// Declare Web Speech API types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function VoiceAgent() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const { toggleGloveMode } = useGloveMode()
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.lang = 'pt-BR'
        recognitionRef.current.interimResults = false

        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase()
          handleVoiceCommand(transcript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
          setIsProcessing(false)
          if (event.error !== 'no-speech') {
            toast.error("Erro ao escutar: " + event.error)
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    setIsListening(false)
    toast(`Comando ouvido: "${command}"`, { duration: 2000 })

    try {
      if (command.includes('adicionar') || command.includes('novo') || command.includes('registrar')) {
        if (command.includes('manutenção') || command.includes('óleo') || command.includes('serviço')) {
          router.push('/maintenance/new')
          toast.success("Abrindo formulário de manutenção!")
        } else if (command.includes('peça') || command.includes('peças')) {
          router.push('/parts')
          toast.success("Abrindo inventário de peças!")
        } else {
          toast("Não entendi o que adicionar. Tente 'Adicionar manutenção'")
        }
      } else if (command.includes('agentes') || command.includes('inteligência') || command.includes('relatório')) {
        router.push('/agents')
        toast.success("Abrindo painel de agentes de IA!")
      } else if (command.includes('luva') || command.includes('modo mecânico')) {
        toggleGloveMode()
        toast.success("Alternando Modo Luva!")
      } else if (command.includes('voltar') || command.includes('início') || command.includes('painel')) {
        router.push('/')
        toast.success("Voltando ao início!")
      } else {
        toast("Comando não reconhecido. Tente 'Adicionar manutenção'.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Seu navegador não suporta reconhecimento de voz.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        toast("Pode falar! O Agente Ninja está escutando...")
      } catch (e) {
        console.error(e)
      }
    }
  }

  const voiceCommands = [
    { cmd: '"Adicionar manutenção"', desc: "Abre o formulário de serviço" },
    { cmd: '"Modo Luva"', desc: "Alterna interface tática" },
    { cmd: '"Agentes"', desc: "Abre painel de IA" },
    { cmd: '"Início"', desc: "Volta ao painel" },
  ]

  return (
    <div className="fixed bottom-[110px] right-6 z-50 flex flex-col items-end gap-4">
      {showCheatSheet && (
        <div className="bg-background border-4 border-foreground p-4 w-64 shadow-[8px_8px_0_0_var(--foreground)] animate-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center border-b-2 border-foreground pb-2 mb-3">
             <h4 className="text-[10px] font-black uppercase tracking-widest italic">Comandos Ninja</h4>
             <button onClick={() => setShowCheatSheet(false)} className="text-[10px] font-black uppercase">X</button>
          </div>
          <div className="space-y-3">
            {voiceCommands.map((v, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-[10px] font-black bg-foreground text-background px-1 inline-block">{v.cmd}</p>
                <p className="text-[9px] font-bold uppercase opacity-60 leading-none">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isListening && (
           <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="h-10 border-4 border-foreground rounded-none bg-background text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_0_var(--foreground)] active:translate-y-1 active:shadow-none"
          >
            Dicas
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleListening}
          disabled={isProcessing}
          className={`h-14 w-14 rounded-full border-4 shadow-[4px_4px_0_0_var(--foreground)] transition-all active:translate-y-1 active:shadow-none
            ${isListening ? 'border-foreground bg-foreground text-background animate-pulse scale-110' : 'border-foreground bg-background text-foreground hover:bg-foreground hover:text-background'}`}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isListening ? (
            <Mic className="h-6 w-6" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  )
}
