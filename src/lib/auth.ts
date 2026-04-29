import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    console.log('🔍 [JWT] Verificando token:', token.substring(0, 50) + '...')
    
    // Se o token for um JSON (bug atual), parse primeiro
    let actualToken = token
    if (token.startsWith('{')) {
      console.log('🔍 [JWT] Token parece ser JSON, fazendo parse...')
      const parsed = JSON.parse(token)
      console.log('🔍 [JWT] Token parseado, mas não é JWT válido')
      return null
    }
    
    const decoded = jwt.verify(actualToken, JWT_SECRET) as AuthUser
    console.log('✅ [JWT] Token válido:', decoded.email)
    return decoded
  } catch (error) {
    console.error('❌ [JWT] Erro na verificação:', error)
    return null
  }
}

export async function createUser(credentials: RegisterCredentials): Promise<AuthUser> {
  const { email, password, name } = credentials
  
  console.log('Tentando criar usuário:', email)
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })
  
  console.log('Usuário já existe:', existingUser ? 'Sim' : 'Não')
  
  if (existingUser) {
    throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.')
  }
  
  // Hash password and create user
  const hashedPassword = await hashPassword(password)
  console.log('Senha hasheada com sucesso')
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  })
  
  console.log('Usuário criado:', user.email)
  return user
}

export async function authenticateUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  const { email, password } = credentials
  
  console.log('🔍 [AUTH] Tentando autenticar usuário:', email)
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true
      }
    })
    
    console.log('🔍 [AUTH] Usuário encontrado no DB:', user ? 'Sim' : 'Não')
    
    if (!user) {
      console.log('❌ [AUTH] Usuário não encontrado no banco de dados')
      return null
    }
    
    console.log('🔍 [AUTH] Verificando senha...')
    const isPasswordValid = await verifyPassword(password, user.password)
    console.log('🔍 [AUTH] Senha válida:', isPasswordValid ? 'Sim' : 'Não')
    
    if (!isPasswordValid) {
      console.log('❌ [AUTH] Senha inválida')
      return null
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    console.log('✅ [AUTH] Autenticação bem-sucedida para:', userWithoutPassword.email)
    return userWithoutPassword
  } catch (error) {
    console.error('❌ [AUTH] Erro durante autenticação:', error)
    return null
  }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  })
  
  return user
}
