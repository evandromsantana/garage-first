import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"

export default async function Home() {
  // Verificar autenticação
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value
  
  if (!authToken) {
    redirect('/auth/login')
  }
  
  const user = verifyToken(authToken)
  if (!user) {
    redirect('/auth/login')
  }

  // Usuário autenticado, redirecionar para dashboard
  redirect('/dashboard')
}
