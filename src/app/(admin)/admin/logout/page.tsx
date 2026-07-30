"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.signOut().then(() => {
      router.push("/")
    })
  }, [router])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logout</h1>
        <p className="text-muted-foreground">Signing out of your account</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <LogOut className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-lg font-medium text-muted-foreground">Logging out...</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait while we sign you out</p>
        </CardContent>
      </Card>
    </div>
  )
}
