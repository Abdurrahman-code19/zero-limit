"use client"

import { Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure store and account settings</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Settings panel is under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
