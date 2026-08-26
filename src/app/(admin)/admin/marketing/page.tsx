"use client"

import { useState, useEffect } from "react"
import { Megaphone, Mail, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Subscriber {
  id: string
  email: string
  created_at: string
}

export default function MarketingPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setSubscribers(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Marketing</h1><div className="h-64 animate-pulse bg-muted rounded" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketing</h1>
        <p className="text-muted-foreground">Manage newsletters and promotions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Newsletter Subscribers</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{subscribers.length}</p>
            <p className="text-sm text-muted-foreground mb-4">Total subscribers</p>
            {subscribers.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                    <span>{sub.email}</span>
                    <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Promotions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-dashed rounded-lg text-center">
                <Megaphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Create coupons from the Coupons page to run promotions.</p>
                <a href="/admin/coupons" className="inline-block mt-2 text-sm font-medium text-primary hover:underline">Go to Coupons →</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
