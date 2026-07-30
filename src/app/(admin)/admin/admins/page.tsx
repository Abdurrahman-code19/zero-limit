"use client"

import { ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminAdminsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admins</h1>
        <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">Admin management is under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
