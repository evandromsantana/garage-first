/**
 * Security Agent - Monitora e melhora a segurança do aplicativo
 * Valida: autenticação, autorização, inputs, XSS, CSRF
 */

import { verifyToken } from '../auth'

// Browser-compatible crypto functions
const generateRandomBytes = (size: number): string => {
  const array = new Uint8Array(size)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

interface SecurityMetrics {
  authenticationAttempts: number
  failedLogins: number
  suspiciousActivities: number
  validatedInputs: number
  blockedRequests: number
}

interface SecurityRule {
  name: string
  description: string
  validate: (input: any) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class SecurityAgent {
  private metrics: SecurityMetrics = {
    authenticationAttempts: 0,
    failedLogins: 0,
    suspiciousActivities: 0,
    validatedInputs: 0,
    blockedRequests: 0
  }

  private rules: SecurityRule[] = [
    {
      name: 'SQL Injection Prevention',
      description: 'Prevents SQL injection attacks',
      validate: (input: string) => {
        const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i
        return !sqlPatterns.test(input)
      },
      severity: 'critical'
    },
    {
      name: 'XSS Prevention',
      description: 'Prevents cross-site scripting attacks',
      validate: (input: string) => {
        const xssPatterns = /(<script|javascript:|on\w+=|data:)/i
        return !xssPatterns.test(input)
      },
      severity: 'high'
    },
    {
      name: 'Email Validation',
      description: 'Validates email format',
      validate: (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(input)
      },
      severity: 'medium'
    },
    {
      name: 'Password Strength',
      description: 'Validates password strength',
      validate: (input: string) => {
        return input.length >= 8 && /[A-Z]/.test(input) && /[0-9]/.test(input)
      },
      severity: 'medium'
    }
  ]

  // Validar input contra regras de segurança
  validateInput(input: string, ruleName?: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = []
    let isValid = true

    const rulesToCheck = ruleName 
      ? this.rules.filter(rule => rule.name === ruleName)
      : this.rules

    for (const rule of rulesToCheck) {
      if (!rule.validate(input)) {
        violations.push(rule.name)
        isValid = false
        this.metrics.suspiciousActivities++
      }
    }

    this.metrics.validatedInputs++
    return { isValid, violations }
  }

  // Sanitizar input para prevenção de XSS
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Gerar token CSRF seguro
  generateCSRFToken(): string {
    return generateRandomBytes(32)
  }

  // Validar token CSRF
  validateCSRFToken(token: string, sessionToken: string): boolean {
    return timingSafeEqual(token, sessionToken)
  }

  // Rate limiting para prevenir brute force
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now()
    const record = this.rateLimitMap.get(identifier)

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxAttempts) {
      this.metrics.blockedRequests++
      return false
    }

    record.count++
    return true
  }

  // Monitorar tentativas de login
  monitorLoginAttempt(email: string, success: boolean) {
    this.metrics.authenticationAttempts++
    
    if (!success) {
      this.metrics.failedLogins++
      
      // Bloquear após muitas tentativas falhas
      if (!this.checkRateLimit(email, 5, 15 * 60 * 1000)) {
        console.warn(`[Security] Too many failed login attempts for: ${email}`)
        this.metrics.blockedRequests++
      }
    }
  }

  // Validar sessão de usuário
  validateSession(token: string): { isValid: boolean; user?: any; reason?: string } {
    try {
      const user = verifyToken(token)
      return { isValid: true, user }
    } catch (error) {
      return { isValid: false, reason: 'Invalid or expired token' }
    }
  }

  // Verificar permissões de usuário
  checkPermissions(user: any, requiredPermissions: string[]): boolean {
    if (!user) return false
    
    // Implementar lógica de permissões baseada no role do usuário
    const userPermissions = user.permissions || []
    return requiredPermissions.every(permission => userPermissions.includes(permission))
  }

  // Gerar hash seguro para senhas (simplified for browser)
  async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const generatedSalt = salt || generateRandomBytes(16)
    const encoder = new TextEncoder()
    const data = encoder.encode(password + generatedSalt)
    const hashBuffer = await crypto.subtle.digest('SHA-512', data)
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return { hash, salt: generatedSalt }
  }

  // Verificar hash de senha
  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const { hash: computedHash } = await this.hashPassword(password, salt)
    return timingSafeEqual(computedHash, hash)
  }

  // Analisar segurança e gerar relatório
  analyzeSecurity(): {
    metrics: SecurityMetrics
    score: number
    recommendations: string[]
    risks: string[]
  } {
    const recommendations: string[] = []
    const risks: string[] = []

    // Análise baseada nas métricas
    if (this.metrics.failedLogins > this.metrics.authenticationAttempts * 0.1) {
      risks.push('High failed login rate - Possible brute force attack')
      recommendations.push('Implement stronger rate limiting')
    }

    if (this.metrics.suspiciousActivities > 100) {
      risks.push('High suspicious activity detected')
      recommendations.push('Review and strengthen input validation')
    }

    if (this.metrics.blockedRequests > 50) {
      risks.push('Many requests blocked - Possible attack')
      recommendations.push('Implement IP-based blocking')
    }

    // Calcular score de segurança
    let score = 100
    const failureRate = this.metrics.failedLogins / Math.max(1, this.metrics.authenticationAttempts)
    score -= failureRate * 30
    score -= (this.metrics.suspiciousActivities / 100) * 20
    score -= (this.metrics.blockedRequests / 50) * 25

    return {
      metrics: this.metrics,
      score: Math.max(0, Math.round(score)),
      recommendations,
      risks
    }
  }

  // Limpar rate limiting map
  cleanup() {
    const now = Date.now()
    for (const [key, record] of this.rateLimitMap.entries()) {
      if (now > record.resetTime) {
        this.rateLimitMap.delete(key)
      }
    }
  }
}

export const securityAgent = new SecurityAgent()
export type { SecurityMetrics, SecurityRule }
