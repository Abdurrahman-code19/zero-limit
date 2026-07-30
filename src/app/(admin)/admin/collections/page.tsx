"use client"

import { Folders } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Collections</h1>
        <p className="text-muted-foreground">Manage product collections and groupings</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Folders className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Collection management is under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
