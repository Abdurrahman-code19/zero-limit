"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ArrowRight, Heart, ShoppingBag, Star, Eye, 
  ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Award 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PRODUCTS } from "@/lib/products"
import { formatCurrency } from "@/utils"
import { useWishlistStore } from "@/store/wishlist"
import type { Product } from "@/types"

const CATEGORIES = [
  { name: "T-Shirts", href: "/shop?category=t-shirts", emoji: "👕" },
  { name: "Shirts", href: "/shop?category=shirts", emoji: "👔" },
  { name: "Caps & Beanies", href: "/shop?category=caps", emoji: "🧢" },
  { name: "Hoodies & Quarter Zips", href: "/shop?category=hoodies", emoji: "🧥" },
]

const FEATURED_COLLECTIONS = [
  {
    name: "Checkers Shirt",
    slug: "zero-limit-checkers-shirt",
    desc: "Statement woven",
    image: "/products/zero-limit-checkers-shirt-1.jpeg",
  },
  {
    name: "Lightning Strike",
    slug: "zero-limit-lightning-strike",
    desc: "Bold graphic",
    image: "/products/zero-limit-lightning-strike-1.jpeg",
  },
  {
    name: "Quarter Zip",
    slug: "zero-limit-quarter-zip",
    desc: "Layered staple",
    image: "/products/zero-limit-quarter-zip-1.jpeg",
  },
]

const QUICK_ACTIONS = [
  { icon: Truck, label: "Track My Order", href: "/orders" },
  { icon: ShoppingBag, label: "Today's Deals", href: "/shop?sale=true" },
  { icon: Star, label: "New Collection", href: "/shop?collection=new" },
]

export default function StorePage() {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div className="space-y-0">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3 space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Categories</p>
              {CATEGORIES.map((cat) => (
                <Link key={cat.name} href={cat.href} className="flex items-center gap-3 group">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="md:col-span-6 text-center space-y-6">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="text-xs tracking-widest uppercase border-white/20 text-zinc-300 mb-4">
                  Luxury Collection Campaign
                </Badge>
                <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
                  Beyond Limits.
                </h1>
                <p className="text-zinc-400 max-w-md mx-auto mb-8">
                  Discover curated fashion pieces that define contemporary elegance.
                </p>
                <Link href="/shop">
                  <Button className="bg-white text-black hover:bg-zinc-200 text-[13px] tracking-widest uppercase rounded-none px-8 py-6">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <button key={i} onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === activeSlide ? "w-8 bg-white" : "w-4 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Quick Actions</p>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.label} href={action.href} className="flex items-center gap-3 group p-3 border border-white/10 hover:border-white/30 transition-colors rounded">
                    <Icon className="h-4 w-4 text-zinc-400 group-hover:text-white" />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{action.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Curated For You</p>
              <h2 className="text-2xl md:text-3xl font-light">Featured Collections</h2>
            </div>
            <Link href="/shop" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group">
              View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURED_COLLECTIONS.map((col, i) => (
              <Link key={col.name} href={`/product/${col.slug}`} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/60 text-xs tracking-widest uppercase mb-2">Collection 0{i + 1}</p>
                      <h3 className="text-2xl font-light text-white mb-1">{col.name}</h3>
                      <p className="text-sm text-zinc-400">{col.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Just Dropped</p>
              <h2 className="text-2xl md:text-3xl font-light">New Arrivals</h2>
            </div>
            <Link href="/shop?sort=newest" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group">
              View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.slice(0, 4).map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Top Rated</p>
              <h2 className="text-2xl md:text-3xl font-light">Best Sellers</h2>
            </div>
            <Link href="/shop?sort=popular" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group">
              View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.filter((p) => p.is_featured).slice(0, 4).map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Popular</p>
              <h2 className="text-2xl md:text-3xl font-light">Trending Now</h2>
            </div>
            <Link href="/shop?sort=popular" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group">
              View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.filter((p) => !p.is_featured).slice(0, 4).map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Complete The Look */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Style Guide</p>
              <h2 className="text-2xl md:text-3xl font-light">Complete The Look</h2>
            </div>
            <Link href="/shop" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group">
              View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="bg-muted/30 p-8 md:p-12 rounded-lg">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {PRODUCTS.slice(0, 3).map((item, i) => (
                <div key={item.id} className="text-center space-y-3">
                  <Link href={`/product/${item.slug}`} className="block">
                    <div className="aspect-square bg-muted rounded-lg max-w-[200px] mx-auto overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  {i > 0 && <p className="text-3xl text-muted-foreground -mb-2">+</p>}
                  <p className="font-medium mt-3">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/shop">
                <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-8 py-6">
                  Shop The Look <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Continue Browsing</p>
              <h2 className="text-2xl md:text-3xl font-light">Recently Viewed</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS.slice(0, 3).map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Stay Connected</p>
          <h2 className="text-2xl font-light mb-3">Subscribe to Zero Limit</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Exclusive drops, early access, and style inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email" placeholder="Email Address"
              className="flex-1 min-w-0 bg-background border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-6 shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "Secure Payment", desc: "100% secure" },
              { icon: RotateCcw, label: "Easy Returns", desc: "7-day returns" },
              { icon: Truck, label: "Fast Delivery", desc: "2-5 days" },
              { icon: Award, label: "Premium Quality", desc: "Best fabrics" },
            ].map((feat) => {
              const Icon = feat.icon
              return (
                <div key={feat.label} className="text-center group">
                  <div className="w-12 h-12 border mx-auto mb-3 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-semibold tracking-wider uppercase mb-1">{feat.label}</h3>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ item, index }: { item: Product; index: number }) {
  const tag = item.is_featured ? "HOT" : ""
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(item.id))
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/product/${item.slug}`} className="group block">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
          <img
            src={item.images[0]}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          {tag && (
            <Badge className="absolute top-3 left-3 z-20 bg-foreground text-background text-[9px] tracking-wider uppercase rounded-none">
              {tag}
            </Badge>
          )}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="w-8 h-8 bg-background flex items-center justify-center hover:bg-muted transition-colors"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(item.id)
              }}
              aria-label={mounted && isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${mounted && isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">4.8</span>
          </div>
          <h4 className="text-sm font-medium group-hover:text-muted-foreground transition-colors">{item.name}</h4>
          <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
          <div className="flex gap-1">
            {item.colors.map((color, i) => (
              <span key={i} className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
