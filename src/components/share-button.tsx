"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

export function ShareButton({ title, text, url }: { title: string, text: string, url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
        toast.success("Compartilhado com sucesso!")
      } catch (err) {
        console.error("Error sharing", err)
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast.success("Link copiado para a área de transferência!")
      } catch (err) {
        toast.error("Erro ao copiar link.")
      }
    }
  }

  return (
    <Button 
      onClick={handleShare} 
      variant="outline" 
      className="border-4 border-black rounded-none font-black uppercase flex items-center gap-2 hover:bg-black hover:text-white transition-colors h-14 px-8"
    >
      <Share2 className="h-6 w-6" />
      Compartilhar Passaporte
    </Button>
  )
}
