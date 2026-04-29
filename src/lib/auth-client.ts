// Client-side auth utilities (no next/headers)
import { verifyToken } from "./auth"

export function parseAuthToken(cookieHeader: string | null) {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=')
    if (name) {
      acc[name] = value || ''
    }
    return acc
  }, {} as Record<string, string>)
  
  return cookies['auth-token'] || null
}

export function verifyClientToken(token: string) {
  try {
    const user = verifyToken(token)
    return user
  } catch {
    return null
  }
}

export function isClientAuthenticated(cookieHeader: string | null) {
  const token = parseAuthToken(cookieHeader)
  if (!token) return false
  
  const user = verifyClientToken(token)
  return !!user
}
