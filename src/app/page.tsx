"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, Instagram, ShoppingBag, Heart, Search,
  ChevronLeft, ChevronRight, Shield, RotateCcw, Truck, Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SplashScreen } from "@/components/splash/splash-screen"
import { LandingNav } from "@/components/layout/landing-nav"
import { BackToTop } from "@/components/layout/back-to-top"
import { useTheme } from "@/components/theme/theme-provider"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { useProducts } from "@/hooks/use-products"
import { formatCurrency } from "@/utils"

const HERO_SLIDES = [
  { id: 1, label: "Streetwear Redefined", light: "bg-zinc-200", dark: "bg-zinc-900", image: "/products/zero-limit-lightning-strike-1.jpeg", product: "Lightning Strike Tee" },
  { id: 2, label: "Luxury Essentials", light: "bg-stone-200", dark: "bg-stone-900", image: "/products/zero-limit-checkers-shirt-1.jpeg", product: "Checkers Shirt" },
  { id: 3, label: "Limited Drops", light: "bg-neutral-200", dark: "bg-neutral-900", image: "/products/zero-limit-quarter-zip-1.jpeg", product: "Quarter Zip" },
]

const FEATURES = [
  { icon: Shield, title: "Secure Payment", desc: "100% secure checkout with Paystack" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery in 2-5 days" },
  { icon: Award, title: "Premium Quality", desc: "Curated fabrics & craftsmanship" },
]

const COLLECTIONS = [
  {
    name: "T-Shirts",
    slug: "t-shirts",
    desc: "Graphic tees & tank tops",
    image: "/products/zero-limit-lightning-strike-1.jpeg",
  },
  {
    name: "Shirts",
    slug: "shirts",
    desc: "Statement checkered fits",
    image: "/products/zero-limit-checkers-shirt-1.jpeg",
  },
  {
    name: "Caps & Beanies",
    slug: "caps",
    desc: "The Zero Limit Bernie",
    image: "/products/zero-limit-bernie-1.jpeg",
  },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [splashDone, setSplashDone] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const { products: PRODUCTS } = useProducts()

  const NEW_ARRIVALS = useMemo(() =>
    PRODUCTS.map((p, i) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.images[0],
      tag: p.is_featured && i < 3 ? "HOT" : p.is_featured ? "" : "NEW",
    })),
  [PRODUCTS])

  useEffect(() => { setMounted(true) }, [])

  const handleQuickAdd = useCallback((e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const product = PRODUCTS.find((p) => p.id === productId)
    if (product && product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, 1, product.sizes[0], product.colors[0])
    }
  }, [PRODUCTS, addItem])

  const handleWishlistToggle = useCallback((e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(productId)
  }, [toggleWishlist])

  const handleSplashComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("zl-splash-seen", "1")
    }
    setSplashDone(true)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem("zl-splash-seen") === "1") {
      setSplashDone(true)
    }
  }, [])

  useEffect(() => {
    if (!splashDone) return
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [splashDone])

  const handleDragStart = (x: number) => { setIsDragging(true); dragStartX.current = x }
  const handleDragEnd = (x: number) => {
    setIsDragging(false)
    const diff = x - dragStartX.current
    if (Math.abs(diff) > 50) {
      setCurrentSlide((p) => diff > 0
        ? (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
        : (p + 1) % HERO_SLIDES.length)
    }
  }

  if (!mounted) return null

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div className={`transition-opacity duration-1000 ${splashDone ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col bg-background text-foreground min-h-screen">

          {/* ─── TOP NAV ─── */}
          <LandingNav />

          {/* ─── HERO SECTION ─── */}
          <section className="relative h-screen flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-6">Premium Fashion</p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight mb-6">
                  ZERO<br />
                  <span className="font-bold italic">LIMIT</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-light max-w-md mb-10 leading-relaxed">
                  Beyond Limits.<br />Beyond Style.
                </p>
                <p className="text-sm text-muted-foreground/70 max-w-sm mb-10 leading-relaxed">
                  Discover curated fashion pieces that define contemporary elegance.
                  Each piece crafted for those who refuse to blend in.
                </p>
                <Link href="/shop">
                  <Button className="bg-foreground text-background hover:bg-foreground/80 text-[13px] tracking-widest uppercase rounded-none px-8 py-6 group transition-all duration-300">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Diagonal Slider */}
            <div className="hidden md:block w-1/2 relative overflow-hidden">
              <div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseUp={(e) => handleDragEnd(e.clientX)}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
              >
                <AnimatePresence mode="popLayout">
                  {HERO_SLIDES.map((slide, i) => (
                    <motion.div
                      key={slide.id}
                      className="absolute inset-0"
                      initial={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0 }}
                      animate={i === currentSlide
                        ? { clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 1, scale: isDragging ? 1 : [1, 1.03] }
                        : { clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img
                        src={slide.image}
                        alt={slide.product}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-[11px] tracking-[0.5em] uppercase mb-4 text-zinc-400">Collection</p>
                          <p className="text-4xl font-light tracking-tight text-white">{slide.label}</p>
                          <div className="mt-4 text-sm text-zinc-300">{slide.product}</div>
                          <div className="mt-8 w-16 h-px mx-auto bg-white/20" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="absolute bottom-12 right-12 flex gap-3 z-10">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-[2px] transition-all duration-500 ${i === currentSlide ? `w-12 ${isDark ? "bg-white" : "bg-black"}` : `w-8 ${isDark ? "bg-white/30 hover:bg-white/50" : "bg-black/30 hover:bg-black/50"}`}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-12 left-12 flex gap-2 z-10">
                  {[ChevronLeft, ChevronRight].map((Icon, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide((p) => idx === 0
                        ? (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                        : (p + 1) % HERO_SLIDES.length)}
                      className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${isDark ? "border-white/20 hover:bg-white hover:text-black" : "border-black/20 hover:bg-black hover:text-white"}`}
                      aria-label={idx === 0 ? "Previous slide" : "Next slide"}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.44 6.3 6.3 0 001.82-4.48V8.12a8.23 8.23 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.53z"/></svg>
                ), label: "TikTok", href: "#" },
                { icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.627.616l4.558-1.21A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.437 0-4.713-.836-6.511-2.236l-.455-.367-2.728.727.727-2.728-.367-.455A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                ), label: "WhatsApp", href: "#" },
                { icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                ), label: "Facebook", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 group ${isDark ? "border-white/20 hover:bg-white hover:text-black" : "border-black/20 hover:bg-black hover:text-white"}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </section>

          {/* ─── BRAND HIGHLIGHTS ─── */}
          <section className="py-20 md:py-28 border-t border-border">
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {FEATURES.map((feat) => (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center group"
                  >
                    <div className="w-14 h-14 border border-border flex items-center justify-center mx-auto mb-5 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── COLLECTIONS ─── */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Curated For You</p>
                  <h2 className="text-3xl md:text-4xl font-light">Collections</h2>
                </div>
                <Link href="/shop" className="text-[12px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                  View All
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COLLECTIONS.map((col, i) => (
                  <motion.div
                    key={col.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                  >
                    <Link href={`/collections/${col.slug}`}>
                      <div className="group relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer">
                        <img
                          src={col.image}
                          alt={col.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t via-black/40 to-transparent z-10 ${isDark ? "from-black" : "from-black/60"}`} />
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <p className="text-[10px] tracking-[0.5em] uppercase text-zinc-400 mb-2">Collection {String(i + 1).padStart(2, "0")}</p>
                          <h3 className="text-2xl font-light mb-2 text-white">{col.name}</h3>
                          <p className="text-sm text-zinc-400 mb-6">{col.desc}</p>
                          <span className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase border-b border-white/30 pb-1 group-hover:border-white transition-colors duration-300 text-white">
                            Shop Now
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── NEW ARRIVALS ─── */}
          <section className="py-20 md:py-28 border-t border-border">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Just Dropped</p>
                  <h2 className="text-3xl md:text-4xl font-light">New Arrivals</h2>
                </div>
                <Link href="/shop" className="text-[12px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                  View All
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {NEW_ARRIVALS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link href={`/product/${item.slug}`}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          {item.tag && (
                            <span className="absolute top-3 left-3 z-10 text-[10px] tracking-wider uppercase bg-foreground text-background px-2 py-1">
                              {item.tag}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 dark:group-hover:bg-black/30 transition-colors duration-500 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <button
                                className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:bg-background/80 transition-colors"
                                aria-label="Add to wishlist"
                                onClick={(e) => handleWishlistToggle(e, item.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </button>
                                <Link
                                 href={`/product/${item.slug}`}
                                 className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:bg-background/80 transition-colors"
                                 aria-label="View product"
                                 onClick={(e) => e.stopPropagation()}
                               >
                                <Search className="h-4 w-4" />
                              </Link>
                              <button
                                className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:bg-background/80 transition-colors"
                                aria-label="Add to cart"
                                onClick={(e) => handleQuickAdd(e, item.id)}
                              >
                                <ShoppingBag className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium mb-1 group-hover:text-muted-foreground transition-colors">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── NEWSLETTER ─── */}
          <section className="py-24 md:py-32 border-t border-border">
            <div className="container mx-auto px-6 md:px-12 text-center">
              <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Stay Connected</p>
              <h2 className="text-3xl md:text-4xl font-light mb-4">Become Part of Zero Limit</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-10">
                Exclusive drops, early access, and style inspiration delivered to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </section>

          {/* ─── FOOTER ─── */}
          <footer className="border-t border-border py-16">
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                  {isDark ? (
                    <Image src="/secondary-logo.png" alt="Zero Limit" width={120} height={36} className="h-7 w-auto brightness-0 invert mb-4" />
                  ) : (
                    <Image src="/secondary-logo.png" alt="Zero Limit" width={120} height={36} className="h-7 w-auto mb-4" />
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    Beyond Limits.<br />Beyond Style.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://instagram.com/zerolimit.store" target="_blank" rel="noopener noreferrer" className={`w-8 h-8 border flex items-center justify-center transition-all duration-300 ${isDark ? "border-white/20 hover:bg-white hover:text-black" : "border-black/20 hover:bg-black hover:text-white"}`}>
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                {[
                  { title: "Account", links: [{ label: "Create Account", href: "/register" }, { label: "My Orders", href: "/orders" }] },
                  { title: "Help", links: [{ label: "Contact Us", href: "/contact" }, { label: "FAQs", href: "/faq" }, { label: "Shipping Info", href: "/shipping" }, { label: "Returns & Exchanges", href: "/returns" }] },
                  { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms & Conditions", href: "/terms" }] },
                ].map((group) => (
                  <div key={group.title}>
                    <h4 className="text-[12px] tracking-widest uppercase mb-4 font-semibold">{group.title}</h4>
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[11px] text-muted-foreground">&copy; {new Date().getFullYear()} Zero Limit. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <BackToTop />
    </>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        required
        className="flex-1 bg-transparent border border-border px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
      />
      <Button type="submit" disabled={status === "loading"} className="bg-foreground text-background hover:bg-foreground/80 text-[13px] tracking-widest uppercase rounded-none px-8 py-4">
        {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
      </Button>
      {status === "error" && <p className="text-xs text-destructive mt-1">Something went wrong. Try again.</p>}
    </form>
  )
}
