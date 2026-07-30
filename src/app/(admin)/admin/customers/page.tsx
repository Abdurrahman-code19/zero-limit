"use client"

import { Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">View and manage your customer base</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Customer management is under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
