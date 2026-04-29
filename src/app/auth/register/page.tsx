import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bike, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { createUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  async function register(formData: FormData) {
    "use server"
    
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("Todos os campos são obrigatórios")
    }
    
    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem")
    }
    
    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres")
    }
    
    try {
      const user = await createUser({ name, email, password })
      
      // Set authentication cookie
      const cookieStore = await cookies()
      cookieStore.set('auth-token', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
      
      redirect('/setup')
    } catch (error) {
      console.error("Register error:", error)
      
      // Se o email já existe, redirecionar para login
      if (error instanceof Error && error.message.includes('já está cadastrado')) {
        redirect('/auth/login?message=email_exists')
      }
      
      // Propagar o erro original para melhor debug
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erro ao criar conta")
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
            Crie sua conta para começar
          </p>
        </div>

        {/* Register Form */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="font-black uppercase text-center">
              Criar Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={register} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider text-xs" htmlFor="name">
                  Nome
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    className="pl-10 border-2 border-foreground rounded-none h-12 font-bold"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 border-2 border-foreground rounded-none h-12 font-bold"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider text-xs" htmlFor="confirmPassword">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    className="pl-10 border-2 border-foreground rounded-none h-12 font-bold"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-black uppercase tracking-widest border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_var(--foreground)] rounded-none hover:bg-foreground hover:text-background hover:scale-[0.98] transition-transform"
              >
                CRIAR CONTA
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-foreground hover:underline font-bold">
                  Faça login
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
              <p>Para testar o sistema, faça login com:</p>
              <p className="font-mono">Email: demo@garageninja.com</p>
              <p className="font-mono">Senha: demo123</p>
            </div>
            <div className="mt-3 pt-3 border-t border-foreground/20">
              <p className="text-xs text-muted-foreground">
                Ou crie sua própria conta acima para começar!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
