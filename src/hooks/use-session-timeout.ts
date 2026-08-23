"use client"

import { useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes
const WARNING_MS = 14 * 60 * 1000 // warn at 14 minutes

export function useSessionTimeout() {
  const router = useRouter()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logout = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/login?reason=session_expired")
      router.refresh()
    } catch (_e) {
      // ignore
    }
  }, [router])

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)

    warningRef.current = setTimeout(() => {
      // Show warning notification
      if (typeof window !== "undefined") {
        const event = new CustomEvent("session-warning", {
          detail: { message: "Your session will expire in 1 minute. Move your mouse or press a key to stay logged in." },
        })
        window.dispatchEvent(event)
      }
    }, WARNING_MS)

    timeoutRef.current = setTimeout(() => {
      logout()
    }, TIMEOUT_MS)
  }, [logout])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      resetTimer()
    })

    const events = ["mousedown", "keydown", "touchstart", "scroll"]
    const handleActivity = () => resetTimer()

    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        resetTimer()
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (warningRef.current) clearTimeout(warningRef.current)
      }
    })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      events.forEach((event) => window.removeEventListener(event, handleActivity))
      subscription.unsubscribe()
    }
  }, [resetTimer])
}
