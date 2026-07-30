"use client"

import { Warehouse } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Track stock levels and warehouse inventory</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Warehouse className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Inventory management is under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
