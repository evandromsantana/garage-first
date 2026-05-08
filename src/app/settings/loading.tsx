import { Settings } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function Loading() {
  return (
    <div className="kindle-page animate-pulse">
      <PageHeader title="TERMINAL DE CONFIGURAÇÃO" icon={<Settings className="h-6 w-6" />} backHref="/" />

      <main className="space-y-8 pt-6 max-w-2xl mx-auto pb-20">
        <div className="h-40 border-4 border-foreground/10 bg-foreground/5" />
        <div className="h-20 border-4 border-foreground/10 bg-foreground/5" />
        <div className="space-y-4">
          <div className="h-16 border-4 border-foreground/10 bg-foreground/5" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 border-4 border-foreground/10 bg-foreground/5" />
            <div className="h-16 border-4 border-foreground/10 bg-foreground/5" />
          </div>
        </div>
        <div className="h-64 border-4 border-foreground/10 bg-foreground/5" />
      </main>
    </div>
  )
}
