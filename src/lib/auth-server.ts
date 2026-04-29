import { cookies } from "next/headers"
import { verifyToken } from "./auth"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value
  
  if (!authToken) {
    return null
  }
  
  try {
    const user = verifyToken(authToken)
    return user
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error("Usuário não autenticado")
  }
  
  return user
}
