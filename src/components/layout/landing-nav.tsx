"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useTheme } from "@/components/theme/theme-provider"

export function LandingNav() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-background/80 backdrop-blur-md border-b border-border/50">
      <Link href="/" className="flex items-center">
        {isDark ? (
          <Image src="/primary-logo.png" alt="Zero Limit" width={140} height={40} className="h-8 w-auto brightness-0 invert" priority />
        ) : (
          <Image src="/primary-logo.png" alt="Zero Limit" width={140} height={40} className="h-8 w-auto" priority />
        )}
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/login" className="hidden md:inline-block text-[13px] tracking-widest uppercase hover:text-muted-foreground transition-colors duration-300">
          Login
        </Link>
        <Link href="/register" className="hidden md:inline-block">
          <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-foreground hover:text-background text-[13px] tracking-widest uppercase rounded-none px-5">
            Sign Up
          </Button>
        </Link>
        <button className="md:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}
