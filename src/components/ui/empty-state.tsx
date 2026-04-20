import { ReactNode } from "react"

interface EmptyStateProps {
  icon?: ReactNode
  message?: string
  className?: string
}

export function EmptyState({
  icon,
  message = "Nenhum dado encontrado",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 border-4 border-dashed border-foreground/30 ${className}`}
    >
      {icon && <div className="mb-4 text-foreground/50">{icon}</div>}
      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">
        {message}
      </p>
    </div>
  )
}
