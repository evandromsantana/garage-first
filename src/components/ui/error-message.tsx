import { AlertTriangle } from "lucide-react"

interface ErrorMessageProps {
  message?: string
  className?: string
}

export function ErrorMessage({
  message = "Erro ao carregar dados",
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 border-4 border-foreground bg-background ${className}`}
    >
      <AlertTriangle className="h-8 w-8 text-foreground" />
      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-center">
        {message}
      </p>
    </div>
  )
}
