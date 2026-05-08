"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await logout()
        // O logout do server action já faz redirect, 
        // mas forçamos um refresh para limpar qualquer cache do cliente
        router.refresh()
      } catch (error) {
        console.error("Erro ao sair:", error)
      }
    })
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleLogout}
      disabled={isPending}
      className="h-12 px-6 border-4 border-destructive bg-background text-destructive hover:bg-destructive hover:text-background transition-none font-black uppercase tracking-widest flex items-center gap-2"
    >
      <LogOut className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Saindo...' : 'Sair'}
    </Button>
  )
}
