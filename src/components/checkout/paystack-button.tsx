"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { generateOrderId } from "@/utils"
import { Lock } from "lucide-react"

interface PaystackButtonProps {
  email: string
  amount: number
  disabled?: boolean
  beforePay?: () => boolean
  onSuccess: (reference: string) => void
  metadata?: Record<string, unknown>
}

interface PaystackResponse {
  reference: string
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string
        email: string
        amount: number
        ref: string
        currency: string
        metadata?: { custom_fields: { display_name: string; variable_name: string; value: string }[] }
        callback: (response: PaystackResponse) => void
        onClose: () => void
      }) => { openIframe: () => void }
    }
  }
}

export function PaystackButton({
  email,
  amount,
  disabled,
  beforePay,
  onSuccess,
  metadata,
}: PaystackButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scriptLoading = useRef(false)

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

  const loadScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") return reject(new Error("No window"))
      if (window.PaystackPop) return resolve()
      if (scriptLoading.current) return
      scriptLoading.current = true
      const script = document.createElement("script")
      script.src = "https://js.paystack.co/v1/inline.js"
      script.onload = () => {
        scriptLoading.current = false
        resolve()
      }
      script.onerror = () => {
        scriptLoading.current = false
        reject(new Error("Failed to load Paystack"))
      }
      document.body.appendChild(script)
    })
  }, [])

  if (!publicKey) {
    return (
      <div className="space-y-3">
        <Button
          className="w-full bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none py-6"
          disabled
        >
          <Lock className="h-4 w-4 mr-2" /> Pay with Paystack
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Payments not configured yet. Add{" "}
          <code className="text-foreground">
            NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
          </code>{" "}
          to enable checkout.
        </p>
      </div>
    )
  }

  const handlePay = async () => {
    if (beforePay && !beforePay()) return

    setLoading(true)
    setError(null)
    try {
      await loadScript()
      if (typeof window === "undefined" || !window.PaystackPop) {
        throw new Error("Paystack failed to load")
      }

      const reference = generateOrderId()

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: Math.round(amount * 100),
        ref: reference,
        currency: "NGN",
        metadata: metadata ? { custom_fields: Object.entries(metadata).map(([key, value]) => ({ display_name: key, variable_name: key, value: String(value) })) } : undefined,
        callback: (response: PaystackResponse) => {
          setLoading(false)
          onSuccess(response.reference)
        },
        onClose: () => setLoading(false),
      })

      handler.openIframe()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        data-paystack-trigger
        onClick={handlePay}
        disabled={disabled || loading}
        className="w-full bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none py-6"
      >
        <Lock className="h-4 w-4 mr-2" />
        {loading ? "Opening Paystack…" : "Pay with Paystack"}
      </Button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  )
}
