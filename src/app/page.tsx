"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, Instagram, ShoppingBag, Heart, Search, User,
  ChevronLeft, ChevronRight, Shield, RotateCcw, Truck, Award,
  Menu, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SplashScreen } from "@/components/splash/splash-screen"
import { useCartStore } from "@/store/cart"

const HERO_SLIDES = [
  { id: 1, label: "Streetwear Redefined", accent: "bg-zinc-900" },
  { id: 2, label: "Luxury Essentials", accent: "bg-stone-900" },
  { id: 3, label: "Limited Drops", accent: "bg-neutral-900" },
]

const FEATURES = [
  { icon: Shield, title: "Secure Payment", desc: "100% secure checkout with Paystack" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery in 2-5 days" },
  { icon: Award, title: "Premium Quality", desc: "Curated fabrics & craftsmanship" },
]

const COLLECTIONS = [
  { name: "Streetwear", slug: "streetwear", desc: "Bold, urban, unapologetic" },
  { name: "Luxury", slug: "luxury", desc: "Refined elegance for every occasion" },
  { name: "Limited Edition", slug: "limited-edition", desc: "Exclusive drops, once gone forever" },
]

const NEW_ARRIVALS = [
  { id: 1, name: "Minimalist Tailored Blazer", price: 289, tag: "NEW" },
  { id: 2, name: "Urban Classic Sneakers", price: 165, tag: "HOT" },
  { id: 3, name: "Signature Crossbody Bag", price: 195, tag: "NEW" },
  { id: 4, name: "Merino Wool Knit Sweater", price: 145, tag: "" },
  { id: 5, name: "Cargo Utility Jacket", price: 225, tag: "NEW" },
  { id: 6, name: "Slim Fit Denim", price: 120, tag: "" },
  { id: 7, name: "Oversized Graphic Tee", price: 65, tag: "HOT" },
  { id: 8, name: "Leather Chelsea Boots", price: 245, tag: "NEW" },
]

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const itemCount = useCartStore((s) => s.getItemCount())

  const handleSplashComplete = useCallback(() => setSplashDone(true), [])

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

  return (
    <>
      {/* Splash Screen */}
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Landing Page */}
      <div className={`transition-opacity duration-1000 ${splashDone ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col bg-black text-white min-h-screen">

          {/* ─── TOP NAV ─── */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
            <Link href="/" className="text-lg md:text-xl font-bold tracking-[0.15em]">
              ZERO LIMIT
            </Link>
            <div className="hidden md:flex items-center gap-8 text-[13px] tracking-widest uppercase">
              <Link href="/home" className="hover:text-zinc-400 transition-colors duration-300">Home</Link>
              <Link href="/collections" className="hover:text-zinc-400 transition-colors duration-300">Collections</Link>
              <Link href="/shop" className="hover:text-zinc-400 transition-colors duration-300">Shop</Link>
              <Link href="/about" className="hover:text-zinc-400 transition-colors duration-300">About</Link>
              <Link href="/contact" className="hover:text-zinc-400 transition-colors duration-300">Contact</Link>
              <Link href="/admin/login" className="hover:text-zinc-400 transition-colors duration-300">Admin</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:inline-block text-[13px] tracking-widest uppercase hover:text-zinc-400 transition-colors duration-300">
                Login
              </Link>
              <Link href="/register" className="hidden md:inline-block">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black text-[13px] tracking-widest uppercase rounded-none px-5">
                  Sign Up
                </Button>
              </Link>
              <button className="md:hidden text-white" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>

          {/* ─── HERO SECTION ─── */}
          <section className="relative h-screen flex">
            {/* Left: Brand */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 mb-6">Premium Fashion</p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight mb-6">
                  ZERO<br />
                  <span className="font-bold italic">LIMIT</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 font-light max-w-md mb-10 leading-relaxed">
                  Beyond Limits.<br />Beyond Style.
                </p>
                <p className="text-sm text-zinc-500 max-w-sm mb-10 leading-relaxed">
                  Discover curated fashion pieces that define contemporary elegance. 
                  Each piece crafted for those who refuse to blend in.
                </p>
                <Link href="/shop">
                  <Button className="bg-white text-black hover:bg-zinc-200 text-[13px] tracking-widest uppercase rounded-none px-8 py-6 group transition-all duration-300">
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
                      className={`absolute inset-0 ${slide.accent}`}
                      initial={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0 }}
                      animate={i === currentSlide
                        ? { clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 1, scale: isDragging ? 1 : [1, 1.03] }
                        : { clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Abstract fashion imagery placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-[11px] tracking-[0.5em] uppercase text-zinc-600 mb-4">Collection</p>
                          <p className="text-4xl font-light tracking-tight text-zinc-300">{slide.label}</p>
                          <div className="mt-8 w-16 h-px bg-white/20 mx-auto" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Slide indicators */}
                <div className="absolute bottom-12 right-12 flex gap-3 z-10">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-8 h-[2px] transition-all duration-500 ${i === currentSlide ? "bg-white w-12" : "bg-white/30 hover:bg-white/50"}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Nav arrows */}
                <div className="absolute bottom-12 left-12 flex gap-2 z-10">
                  <button
                    onClick={() => setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                    className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length)}
                    className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom-right social icons */}
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
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </section>

          {/* ─── BRAND HIGHLIGHTS ─── */}
          <section className="py-20 md:py-28 border-t border-white/10">
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
                    <div className="w-14 h-14 border border-white/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-white group-hover:text-black transition-all duration-500">
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">{feat.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
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
                  <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 mb-3">Curated For You</p>
                  <h2 className="text-3xl md:text-4xl font-light">Collections</h2>
                </div>
                <Link href="/collections" className="text-[12px] tracking-widest uppercase text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group">
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
                      <div className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 cursor-pointer">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        {/* Hover zoom */}
                        <div className="absolute inset-0 bg-zinc-800 scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" />
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <p className="text-[10px] tracking-[0.5em] uppercase text-zinc-400 mb-2">Collection {String(i + 1).padStart(2, "0")}</p>
                          <h3 className="text-2xl font-light mb-2">{col.name}</h3>
                          <p className="text-sm text-zinc-400 mb-6">{col.desc}</p>
                          <span className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase border-b border-white/30 pb-1 group-hover:border-white transition-colors duration-300">
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
          <section className="py-20 md:py-28 border-t border-white/10">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 mb-3">Just Dropped</p>
                  <h2 className="text-3xl md:text-4xl font-light">New Arrivals</h2>
                </div>
                <Link href="/shop?sort=newest" className="text-[12px] tracking-widest uppercase text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group">
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
                    <Link href={`/product/${item.id}`}>
                      <div className="group cursor-pointer">
                        {/* Image area */}
                        <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden mb-4">
                          <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-700 ease-out" />
                          {/* Tag */}
                          {item.tag && (
                            <span className="absolute top-3 left-3 z-10 text-[10px] tracking-wider uppercase bg-white text-black px-2 py-1">
                              {item.tag}
                            </span>
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <button className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors" aria-label="Add to wishlist">
                                <Heart className="h-4 w-4" />
                              </button>
                              <button className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors" aria-label="Quick view">
                                <Search className="h-4 w-4" />
                              </button>
                              <button className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors" aria-label="Add to cart">
                                <ShoppingBag className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Info */}
                        <h4 className="text-sm font-medium mb-1 group-hover:text-zinc-300 transition-colors">{item.name}</h4>
                        <p className="text-sm text-zinc-500">${item.price}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── NEWSLETTER ─── */}
          <section className="py-24 md:py-32 border-t border-white/10">
            <div className="container mx-auto px-6 md:px-12 text-center">
              <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 mb-4">Stay Connected</p>
              <h2 className="text-3xl md:text-4xl font-light mb-4">Become Part of Zero Limit</h2>
              <p className="text-sm text-zinc-500 max-w-md mx-auto mb-10">
                Exclusive drops, early access, and style inspiration delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-transparent border border-white/20 px-5 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                />
                <Button type="submit" className="bg-white text-black hover:bg-zinc-200 text-[13px] tracking-widest uppercase rounded-none px-8 py-4">
                  Subscribe
                </Button>
              </form>
            </div>
          </section>

          {/* ─── FOOTER ─── */}
          <footer className="border-t border-white/10 py-16">
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                  <h3 className="text-lg font-bold tracking-[0.15em] mb-4">ZERO LIMIT</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                    Beyond Limits.<br />Beyond Style.
                  </p>
                  <div className="flex gap-3">
                    {[Instagram].map((Icon, i) => (
                      <a key={i} href="#" className="w-8 h-8 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
                {/* Links */}
                {[
                  { title: "Shop", links: ["New Arrivals", "Best Sellers", "Collections", "Sale"] },
                  { title: "About", links: ["Our Story", "Careers", "Press"] },
                  { title: "Help", links: ["Contact Us", "FAQs", "Shipping", "Returns"] },
                  { title: "Legal", links: ["Privacy Policy", "Terms & Conditions"] },
                ].map((group) => (
                  <div key={group.title}>
                    <h4 className="text-[12px] tracking-widest uppercase mb-4 font-semibold">{group.title}</h4>
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link}>
                          <Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">{link}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[11px] text-zinc-600">&copy; {new Date().getFullYear()} Zero Limit. All rights reserved.</p>
                <div className="flex gap-4 text-[11px] text-zinc-600">
                  <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                  <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
