"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">Moderate customer reviews and ratings</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Review management is under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
