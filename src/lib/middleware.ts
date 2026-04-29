import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './auth'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/setup'
]

// Rotas que redirecionam para dashboard se já estiver autenticado
const authRoutes = [
  '/auth/login',
  '/auth/register'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )

  // Verificar se é uma rota de auth
  const isAuthRoute = authRoutes.some(route => pathname === route)

  // Obter token do cookie
  const token = request.cookies.get('auth-token')?.value

  let user = null
  if (token) {
    try {
      user = verifyToken(token)
    } catch (error) {
      // Token inválido, continuar sem usuário
    }
  }

  // Se usuário está autenticado e tenta acessar rota de auth
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se usuário não está autenticado e tenta acessar rota protegida
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se usuário está autenticado e tenta acessar home sem veículo
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
