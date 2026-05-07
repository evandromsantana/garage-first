import { VehicleSkeleton } from "@/components/dashboard/vehicle-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-16 w-48 bg-muted animate-pulse border-4 border-foreground/20" />
        <VehicleSkeleton />
      </div>
    </div>
  )
}
