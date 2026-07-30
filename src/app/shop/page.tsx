"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  SlidersHorizontal, Grid3X3, List, Heart, Star, 
  ChevronDown, X, Search 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const CATEGORIES = [
  "All", "New Arrivals", "Streetwear", "Luxury", "T-Shirts",
  "Hoodies", "Cargo Pants", "Jeans", "Footwear", "Accessories", "Sale"
]

const ALL_PRODUCTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: [
    "Minimalist Tailored Blazer", "Urban Classic Sneakers", 
    "Signature Crossbody Bag", "Merino Wool Knit Sweater",
    "Cargo Utility Jacket", "Slim Fit Denim",
    "Oversized Graphic Tee", "Leather Chelsea Boots",
    "Cashmere Overcoat", "Silk Evening Dress",
    "Premium Hoodie", "Wide Leg Trousers",
    "Denim Jacket", "Canvas Sneakers",
    "Leather Backpack", "Wool Beanie",
    "Polo Shirt", "Chino Shorts",
    "Bomber Jacket", "Dress Shirt",
    "Sport Watch", "Sunglasses",
    "Leather Belt", "Cashmere Scarf"
  ][i % 24],
  price: [289, 165, 195, 145, 225, 120, 65, 245, 450, 320, 129, 180, 160, 85, 210, 35, 95, 75, 250, 110, 199, 89, 59, 149][i],
  category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
  rating: (4 + Math.random()).toFixed(1),
  colors: ["#000", "#fff", "#c0392b", "#2c3e50"].slice(0, (i % 4) + 1),
  tag: i % 5 === 0 ? "NEW" : i % 7 === 0 ? "SALE" : i % 11 === 0 ? "HOT" : "",
}))

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")

  const filtered = activeCategory === "All" 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Shop</span>
      </div>

      <div className="flex items-start gap-8">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-6">
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    activeCategory === cat 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Price Range</h3>
            <div className="space-y-2">
              {["Under $50", "$50 - $100", "$100 - $200", "$200 - $500", "Over $500"].map((range) => (
                <label key={range} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-input" />
                  {range}
                </label>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {["#000", "#fff", "#c0392b", "#2c3e50", "#27ae60", "#f39c12", "#8e44ad", "#e74c3c"].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-background p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
              </div>
              { /* same filter content */ }
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-foreground font-medium">{filtered.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-muted" : ""}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-muted" : ""}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border rounded px-2 py-1.5 text-sm focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 md:grid-cols-3 gap-4" 
            : "space-y-4"
          }>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/shop`} className={`group block ${viewMode === "list" ? "flex gap-4" : ""}`}>
                  <div className={`relative bg-muted overflow-hidden mb-3 ${viewMode === "grid" ? "aspect-[3/4]" : "w-40 aspect-[3/4] shrink-0"}`}>
                    {product.tag && (
                      <Badge className="absolute top-2 left-2 z-10 bg-foreground text-background text-[9px] tracking-wider uppercase rounded-none">
                        {product.tag}
                      </Badge>
                    )}
                    <button className="absolute top-2 right-2 z-10 w-7 h-7 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {viewMode === "grid" && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    )}
                    <h4 className="text-sm font-medium group-hover:text-muted-foreground transition-colors">{product.name}</h4>
                    <p className="text-sm font-semibold">${product.price}</p>
                    {viewMode === "grid" && (
                      <div className="flex gap-1">
                        {product.colors.map((color, i) => (
                          <span key={i} className="w-3 h-3 rounded-full border" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            {[1, 2, 3, "...", 8].map((page, i) => (
              <button
                key={i}
                className={`w-9 h-9 text-sm rounded ${
                  page === 1 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
