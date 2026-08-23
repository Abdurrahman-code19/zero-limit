"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BackToTop } from "@/components/layout/back-to-top"
import { useSessionTimeout } from "@/hooks/use-session-timeout"
import { AlertCircle } from "lucide-react"

function SessionWarning() {
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setWarning(detail?.message ?? null)
      setTimeout(() => setWarning(null), 10000)
    }
    window.addEventListener("session-warning", handler)
    return () => window.removeEventListener("session-warning", handler)
  }, [])

  if (!warning) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-start gap-3 shadow-lg">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-700 dark:text-yellow-300">{warning}</p>
      </div>
    </div>
  )
}

export function StoreShell({ children }: { children: React.ReactNode }) {
  useSessionTimeout()

  return (
    <div className="flex flex-col min-h-screen">
      <SessionWarning />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  )
}
