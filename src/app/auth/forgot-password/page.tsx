import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bike, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default async function ForgotPasswordPage() {
  async function forgotPassword(formData: FormData) {
    "use server"
    
    const email = formData.get("email") as string
    
    if (!email) {
      throw new Error("Email é obrigatório")
    }
    
    // TODO: Implementar lógica de envio de email
    // Por enquanto, apenas simula o envio
    console.log("Email de recuperação enviado para:", email)
    
    // Em produção, aqui você enviaria um email com link de reset
    // Ex: await sendPasswordResetEmail(email)
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
            Recuperar sua senha
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="bg-card border-4 border-foreground rounded-none shadow-[4px_4px_0_0_var(--foreground)]">
          <CardHeader className="border-b-4 border-foreground pb-4">
            <CardTitle className="font-black uppercase text-center">
              Esqueceu a Senha
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={forgotPassword} className="space-y-4">
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

              <div className="p-4 bg-muted border-2 border-dashed border-foreground/50 rounded text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <p className="font-bold text-foreground mb-1">Como funciona:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Digite seu email cadastrado</li>
                      <li>• Receberá um link de recuperação</li>
                      <li>• Clique no link para criar nova senha</li>
                      <li>• O link expira em 1 hora</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-black uppercase tracking-widest border-4 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_var(--foreground)] rounded-none hover:bg-foreground hover:text-background hover:scale-[0.98] transition-transform"
              >
                ENVIAR LINK DE RECUPERAÇÃO
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                Lembrou da senha?{" "}
                <Link href="/auth/login" className="text-foreground hover:underline font-bold">
                  Faça login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <Card className="bg-muted border-4 border-dashed border-foreground/50 rounded-none">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-bold uppercase mb-2">Outras Opções</p>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>Não recebeu o email?</p>
              <div className="space-y-1">
                <p>• Verifique sua caixa de spam</p>
                <p>• Confirme o email está correto</p>
                <p>• Tente novamente em alguns minutos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
