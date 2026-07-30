"use client"

import { ScrollText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">Audit trail of admin actions and system events</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Activity logs are under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
