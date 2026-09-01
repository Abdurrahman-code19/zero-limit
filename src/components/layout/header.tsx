"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, Heart, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { CartDrawer } from "@/components/layout/cart-drawer"
import { SearchOverlay } from "@/components/layout/search-overlay"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

const accountLinks = [
  { label: "My Profile", href: "/profile" },
  { label: "My Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Addresses", href: "/addresses" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      if (data.user) {
        const name =
          (data.user.user_metadata?.full_name as string) ||
          data.user.email?.split("@")[0] ||
          "Member"
        setUser({ name, email: data.user.email ?? "" })
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (session?.user) {
        const name =
          (session.user.user_metadata?.full_name as string) ||
          session.user.email?.split("@")[0] ||
          "Member"
        setUser({ name, email: session.user.email ?? "" })
      } else {
        setUser(null)
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsUserMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/primary-logo.png"
                alt="Zero Limit"
                width={140}
                height={40}
                className="h-7 w-auto"
                priority
              />
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                title="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  title="Account"
                >
                  <User className="h-5 w-5" />
                </Button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-60 bg-background border rounded-lg shadow-lg z-50 py-1">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b">
                            <p className="text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          {[
                            { label: "My Profile", href: "/profile" },
                            { label: "My Orders", href: "/orders" },
                            { label: "Wishlist", href: "/wishlist" },
                            { label: "Addresses", href: "/addresses" },
                          ].map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block px-4 py-2 text-sm hover:bg-muted"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted border-t mt-1"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-3 border-b">
                            <p className="text-sm font-medium">Welcome</p>
                            <p className="text-xs text-muted-foreground">
                              Sign in for the full experience
                            </p>
                          </div>
                          <Link
                            href="/login"
                            className="block px-4 py-2 text-sm hover:bg-muted"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            className="block px-4 py-2 text-sm hover:bg-muted"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>

              <Link href={user ? "/profile" : "/login"}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

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
              <Image
                src="/primary-logo.png"
                alt="Zero Limit"
                width={120}
                height={32}
                className="h-6 w-auto"
              />
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

            <div className="flex flex-col px-3 py-4">
              {user ? (
                <>
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account
                  </p>
                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-3 py-3 text-sm font-medium hover:bg-muted rounded-md min-h-[44px] flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleSignOut()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-3 text-sm text-destructive hover:bg-muted rounded-md min-h-[44px] mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full min-h-[44px] rounded-none text-xs tracking-widest uppercase">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full min-h-[44px] rounded-none text-xs tracking-widest uppercase bg-foreground text-background">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
