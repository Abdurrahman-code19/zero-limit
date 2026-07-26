"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 left-8 z-50 w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      } ${
        isDark
          ? "border-white/20 hover:bg-white hover:text-black"
          : "border-black/20 hover:bg-black hover:text-white"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
