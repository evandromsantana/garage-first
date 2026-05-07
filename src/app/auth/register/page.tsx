import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, generateToken } from "@/lib/auth"
import { Bike, Lock, Mail, User } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
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
      const token = generateToken(user)
      cookieStore.set('auth-token', token, {
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
    <div className="kindle-page flex items-center justify-center">
      <div className="w-full max-w-md space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-foreground text-background flex items-center justify-center border-4 border-foreground">
            <Bike className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Garage Ninja</h1>
            <p className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Novo Registro de Oficina</p>
          </div>
        </div>

        {/* Register Form */}
        <Card className="kindle-card">
          <CardHeader className="pb-6 border-b-4 border-foreground">
            <CardTitle className="font-black uppercase text-2xl tracking-tight italic">
              Criar Credenciais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={register} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest" htmlFor="name">
                  Nome do Proprietário
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-12 border-4 border-foreground rounded-none h-14 font-bold bg-background focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest" htmlFor="email">
                  Endereço Eletrônico (Email)
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ex: ninja@garageninja.com"
                    className="pl-12 border-4 border-foreground rounded-none h-14 font-bold bg-background focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest" htmlFor="password">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 border-4 border-foreground rounded-none h-14 font-bold bg-background focus-visible:ring-0"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest" htmlFor="confirmPassword">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 border-4 border-foreground rounded-none h-14 font-bold bg-background focus-visible:ring-0"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 text-xl font-black uppercase tracking-[0.2em] border-4 border-foreground bg-foreground text-background rounded-none hover:bg-background hover:text-foreground transition-none"
              >
                REGISTRAR CONTA
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-foreground/30 text-center">
              <Link href="/auth/login" className="text-sm font-black uppercase tracking-widest hover:underline">
                Já possui acesso? Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
