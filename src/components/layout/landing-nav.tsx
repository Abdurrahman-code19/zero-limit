"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useTheme } from "@/components/theme/theme-provider"

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

export function LandingNav() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen])

  return (
    <>
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
          <button
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-[90] w-72 max-w-[85vw] bg-background border-r shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              {isDark ? (
                <Image src="/primary-logo.png" alt="Zero Limit" width={120} height={32} className="h-6 w-auto brightness-0 invert" />
              ) : (
                <Image src="/primary-logo.png" alt="Zero Limit" width={120} height={32} className="h-6 w-auto" />
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 hover:bg-muted rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col px-3 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-sm font-medium hover:bg-muted rounded-md min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t mx-3" />

            <div className="flex flex-col gap-2 px-3 py-4">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full min-h-[44px] rounded-none text-[13px] tracking-widest uppercase border-border">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full min-h-[44px] rounded-none text-[13px] tracking-widest uppercase bg-foreground text-background">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
