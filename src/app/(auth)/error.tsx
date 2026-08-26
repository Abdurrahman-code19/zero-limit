"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[Auth Error]", error) }, [error])
  return (
    <div className="container mx-auto px-4 py-32 text-center space-y-6">
      <h2 className="text-xl font-light">Authentication Error</h2>
      <p className="text-muted-foreground max-w-md mx-auto">An unexpected error occurred during authentication. Please try again.</p>
      <Button variant="outline" onClick={reset}>Try Again</Button>
    </div>
  )
}
