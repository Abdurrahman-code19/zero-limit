"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[Admin Error]", error) }, [error])
  return (
    <div className="container mx-auto px-4 py-32 text-center space-y-6">
      <h2 className="text-xl font-light">Admin Panel Error</h2>
      <p className="text-muted-foreground max-w-md mx-auto">An unexpected error occurred in the admin panel. Please try again.</p>
      <Button variant="outline" onClick={reset}>Try Again</Button>
    </div>
  )
}
