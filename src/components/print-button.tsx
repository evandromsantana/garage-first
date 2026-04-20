"use client"

import { Button } from "@/components/ui/button"
import { Share2, Printer } from "lucide-react"
import { useShare, usePrint } from "@/hooks/use-share"

interface PrintButtonProps {
  title?: string
  text?: string
}

export function PrintButton({
  title = "Passaporte Mecânico | Ninja 400",
  text = "Confira as métricas reais e o rigor de manutenção da minha moto gerados pelo Garage Ninja."
}: PrintButtonProps) {
  const { share } = useShare()
  const print = usePrint()

  const handleShare = () => {
    share({
      title,
      text,
      url: typeof window !== "undefined" ? window.location.href : ""
    })
  }

  return (
    <div className="w-full flex gap-3">
      <Button
        size="lg"
        className="flex-1 h-16 text-[15px] font-black rounded-none border-4 border-foreground shadow-[4px_4px_0_0_var(--foreground)] hover:scale-[0.98] transition-transform"
        onClick={print}
      >
        <Printer className="w-5 h-5 mr-2" />
        IMPRIMIR PDF
      </Button>

      <Button
        size="lg"
        className="flex-1 h-16 text-[15px] font-black rounded-none border-4 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background shadow-[4px_4px_0_0_var(--foreground)] hover:scale-[0.98] transition-transform"
        onClick={handleShare}
      >
        <Share2 className="w-5 h-5 mr-2" />
        COMPARTILHAR LAUDO
      </Button>
    </div>
  )
}
