import { Card, CardContent } from "@/components/ui/card"
import { Bike } from "lucide-react"

export default function Loading() {
  return (
    <div className="kindle-page space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b-4 border-foreground pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-foreground/10 border-2 border-foreground/20 flex items-center justify-center">
            <Bike className="h-6 w-6 opacity-20" />
          </div>
          <div>
            <div className="h-8 w-48 bg-foreground/10 mb-2" />
            <div className="h-4 w-32 bg-foreground/10 opacity-50" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 border-2 border-foreground/20" />
          <div className="w-10 h-10 border-2 border-foreground/20" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Metrics Skeleton */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="kindle-card">
            <CardContent className="p-6 space-y-4">
              <div className="h-4 w-24 bg-foreground/10" />
              <div className="h-12 w-full bg-foreground/10" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-foreground/10" />
                <div className="h-16 bg-foreground/10" />
              </div>
            </CardContent>
          </Card>
          <Card className="kindle-card">
            <CardContent className="p-6">
              <div className="h-40 w-full bg-foreground/10" />
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 border-4 border-foreground/10" />
          ))}
        </div>

        {/* Predictive Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-foreground/10" />
            <div className="h-32 bg-foreground/10" />
            <div className="h-20 bg-foreground/10" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-foreground/10" />
            <div className="h-48 bg-foreground/10" />
          </div>
        </section>
      </main>
    </div>
  )
}
