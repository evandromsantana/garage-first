import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
  className?: string
}

export function Loading({ message = "Carregando...", className = "" }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {message}
      </p>
    </div>
  )
}
