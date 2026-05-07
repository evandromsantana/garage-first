import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticateUser, generateToken } from "@/lib/auth"
import { Bike, Lock, Mail } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
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
      const user = await authenticateUser({ email, password })
      if (!user) {
        throw new Error("Email ou senha inválidos")
      }
      
      const cookieStore = await cookies()
      const token = generateToken(user)
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
      
      redirect('/dashboard')
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error("Erro ao fazer login")
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
            <p className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Manual do Proprietário</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="kindle-card">
          <CardHeader className="pb-6 border-b-4 border-foreground">
            <CardTitle className="font-black uppercase text-2xl tracking-tight italic">
              Acesso à Biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={login} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest" htmlFor="email">
                  Identificação (Email)
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

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest" htmlFor="password">
                  Código de Acesso (Senha)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 pr-12 border-4 border-foreground rounded-none h-14 font-bold bg-background focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 text-xl font-black uppercase tracking-[0.2em] border-4 border-foreground bg-foreground text-background rounded-none hover:bg-background hover:text-foreground transition-none"
              >
                AUTENTICAR
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-foreground/30 text-center space-y-4">
              <Link href="/auth/register" className="block text-sm font-black uppercase tracking-widest hover:underline">
                Não tem conta? Registre seu veículo
              </Link>
              <div className="bg-muted p-4 border-2 border-foreground">
                <p className="text-[10px] font-black uppercase mb-1">Acesso Demonstração</p>
                <p className="text-xs font-bold font-mono">demo@garageninja.com / demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-40 italic">
          Copyright © 2026 Garage Ninja Technical Press
        </p>
      </div>
    </div>
  )
}
