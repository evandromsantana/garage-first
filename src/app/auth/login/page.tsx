import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bike, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { authenticateUser, generateToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  async function login(formData: FormData) {
    "use server"
    
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios")
    }
    
    try {
      console.log('🔍 Tentando login com:', { email, passwordLength: password.length })
      
      const user = await authenticateUser({ email, password })
      
      console.log('🔍 Resultado authenticateUser:', user ? 'Sucesso' : 'Falha')
      
      if (!user) {
        console.log('❌ Usuário não encontrado ou senha inválida')
        throw new Error("Email ou senha inválidos")
      }
      
      console.log('✅ Usuário autenticado:', { id: user.id, email: user.email, name: user.name })
      
      // Set authentication cookie
      const cookieStore = await cookies()
      const token = generateToken(user)
      console.log('🔍 [LOGIN] Gerando JWT token para:', user.email)
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
      
      console.log('🍪 Cookie definido, redirecionando para /dashboard')
      redirect('/dashboard')
    } catch (error) {
      console.error("❌ Login error:", error)
      // Propagar o erro original para melhor debug
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erro ao fazer login")
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
            <Bike className="h-8 w-8 text-background" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Garage Ninja</h1>
          <p className="text-muted-foreground font-bold">
            Faça login para acessar seu painel
          </p>
        </div>

        {/* Message Alert */}
        {message === 'email_exists' && (
          <Card className="bg-yellow-50 border-4 border-yellow-400 rounded-none">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-bold text-yellow-800">
                Este email já está cadastrado! Use as credenciais abaixo:
              </p>
              <p className="text-xs font-mono text-yellow-700 mt-2">
                Email: demo@garageninja.com<br/>
                Senha: demo123
              </p>
            </CardContent>
          </Card>
        )}

        {/* Login Form */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="font-black uppercase text-center">
              Entrar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={login} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider text-xs" htmlFor="email">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 border-2 border-foreground rounded-none h-12 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider text-xs" htmlFor="password">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 pr-10 border-2 border-foreground rounded-none h-12 font-bold"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-black uppercase tracking-widest border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_var(--foreground)] rounded-none hover:bg-foreground hover:text-background hover:scale-[0.98] transition-transform"
              >
                ENTRAR
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-foreground underline">
                Esqueceu sua senha?
              </Link>
              <div className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/auth/register" className="text-foreground hover:underline font-bold">
                  Registre-se
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="bg-muted border-4 border-dashed border-foreground/50 rounded-none">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-bold uppercase mb-2">Acesso de Demonstração</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Email: demo@garageninja.com</p>
              <p>Senha: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
