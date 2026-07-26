"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag, Heart, TrendingUp, Flame, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const TRENDING_PRODUCTS = [
  { id: 1, name: "Minimalist Tailored Blazer", price: 289, category: "Outerwear" },
  { id: 2, name: "Urban Classic Sneakers", price: 165, category: "Footwear" },
  { id: 3, name: "Signature Crossbody Bag", price: 195, category: "Accessories" },
  { id: 4, name: "Merino Wool Knit Sweater", price: 145, category: "Knitwear" },
]

const CATEGORIES = [
  { name: "Hoodies", slug: "hoodies", count: 48 },
  { name: "T-Shirts", slug: "t-shirts", count: 62 },
  { name: "Shirts", slug: "shirts", count: 35 },
  { name: "Cargo Pants", slug: "cargo-pants", count: 28 },
  { name: "Jackets", slug: "jackets", count: 41 },
  { name: "Footwear", slug: "footwear", count: 33 },
  { name: "Accessories", slug: "accessories", count: 55 },
  { name: "Caps", slug: "caps", count: 19 },
]

export default function StoreHome() {
  return (
    <div className="flex flex-col">

      {/* ─── HERO BANNER ─── */}
      <section className="relative h-[60vh] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 mb-4">New Season</p>
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
              Elevate Your <span className="font-bold italic">Style</span>
            </h1>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Discover curated fashion pieces that define contemporary elegance.
            </p>
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-zinc-200 text-[13px] tracking-widest uppercase rounded-none px-8 py-6 group">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-lg font-light mb-6">Shop by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="flex-shrink-0 border border-border px-5 py-3 hover:bg-foreground hover:text-background transition-all duration-300 text-sm"
              >
                {cat.name}
                <span className="text-xs text-muted-foreground ml-2 group-hover:text-zinc-400">({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRENDING ─── */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-light">Trending Now</h2>
            </div>
            <Link href="/shop?sort=popular" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
              View All
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING_PRODUCTS.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button className="w-9 h-9 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors" aria-label="Wishlist">
                          <Heart className="h-3.5 w-3.5" />
                        </button>
                        <button className="w-9 h-9 bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors" aria-label="Add to cart">
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                  <h4 className="text-sm font-medium group-hover:text-muted-foreground transition-colors">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH SALE ─── */}
      <section className="py-12 border-b bg-muted/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-light">Flash Sale</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Ends in 02:14:36</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-zinc-200" />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 uppercase tracking-wider">-30%</span>
                </div>
                <h4 className="text-sm font-medium">Flash Item {i}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold">${Math.floor(Math.random() * 100 + 50)}</span>
                  <span className="text-xs text-muted-foreground line-through">${Math.floor(Math.random() * 100 + 100)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-light">Best Sellers</h2>
            </div>
            <Link href="/shop?sort=popular" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
              View All
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING_PRODUCTS.map((product, i) => (
              <Link key={i} href={`/product/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-current" /> Best
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                  <h4 className="text-sm font-medium group-hover:text-muted-foreground transition-colors">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENTLY VIEWED (placeholder) ─── */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-lg font-light mb-6">Recently Viewed</h2>
          <p className="text-sm text-muted-foreground">Start browsing to see your recently viewed items here.</p>
        </div>
      </section>

      {/* ─── RECOMMENDED ─── */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-lg font-light mb-6">Recommended For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[5, 6, 7, 8].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-muted overflow-hidden mb-3">
                  <div className="w-full h-full bg-zinc-200" />
                </div>
                <h4 className="text-sm font-medium">Suggested Item {i}</h4>
                <p className="text-sm text-muted-foreground mt-1">${Math.floor(Math.random() * 200 + 50)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
