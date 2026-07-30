"use client"

import { useState } from "react"
import Link from "next/link"
import { setupAdminUser } from "@/lib/actions/setup"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleSetup = async () => {
    setLoading(true)
    setResult(null)
    const res = await setupAdminUser()
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full bg-background border rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Admin Setup</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Click the button below to create or reset the admin account.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left text-sm space-y-1">
          <p><strong>Email:</strong> zerolimitunlimited@gmail.com</p>
          <p><strong>Password:</strong> Zero_Limitv1</p>
          <p><strong>Role:</strong> Super Admin</p>
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 text-sm ${
            result.success 
              ? "bg-green-500/10 border border-green-500/20 text-green-600" 
              : "bg-red-500/10 border border-red-500/20 text-red-500"
          }`}>
            {result.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <p>{result.message || result.error}</p>
          </div>
        )}

        <Button 
          onClick={handleSetup} 
          disabled={loading}
          className="w-full bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Setting up...</> : "Setup Admin Account"}
        </Button>

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p><Link href="/admin/login" className="text-primary hover:underline">Go to Admin Login</Link></p>
          <p><Link href="/" className="hover:underline">Back to Home</Link></p>
        </div>
      </div>
    </div>
  )
}
