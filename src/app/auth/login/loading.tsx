import { Bike } from "lucide-react"

export default function Loading() {
  return (
    <div className="kindle-page flex items-center justify-center animate-pulse">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-foreground/10 border-4 border-foreground/20 flex items-center justify-center">
            <Bike className="h-10 w-10 opacity-20" />
          </div>
          <div className="h-8 w-48 bg-foreground/10 mx-auto" />
          <div className="h-4 w-32 bg-foreground/10 mx-auto opacity-50" />
        </div>
        <div className="h-96 border-4 border-foreground/10 bg-foreground/5" />
      </div>
    </div>
  )
}
