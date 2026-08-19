"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { SlidersHorizontal, Grid3X3, List, Heart, X, Search, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/store/product-card"
import { PRODUCT_CATEGORIES } from "@/constants"
import { useProducts } from "@/hooks/use-products"
import { formatCurrency } from "@/utils"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
]

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c.name])
)

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") ?? "all"
  const initialQuery = searchParams.get("q") ?? ""

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [query, setQuery] = useState(initialQuery)
  const [activeSize, setActiveSize] = useState<string | null>(null)
  const [activeColor, setActiveColor] = useState<string | null>(null)

  const { products: dbProducts, loading } = useProducts()
  const available = useMemo(() => dbProducts.filter((p) => p.is_published), [dbProducts])

  const sizes = useMemo(
    () => Array.from(new Set(available.flatMap((p) => p.sizes))),
    [available]
  )

  const colors = useMemo(
    () => Array.from(new Set(available.flatMap((p) => p.colors))),
    [available]
  )

  const categories = useMemo(() => {
    const slugs = Array.from(new Set(available.map((p) => p.category_id)))
    return PRODUCT_CATEGORIES.filter((c) => slugs.includes(c.slug))
  }, [available])

  const filtered = useMemo(() => {
    let result = available

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category_id === activeCategory)
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (activeSize) {
      result = result.filter((p) => p.sizes.includes(activeSize))
    }

    if (activeColor) {
      result = result.filter((p) => p.colors.includes(activeColor))
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "popular":
        result = [...result].sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
        break
      default:
        break
    }

    return result
  }, [available, activeCategory, query, activeSize, activeColor, sortBy])

  const clearFilters = () => {
    setActiveCategory("all")
    setQuery("")
    setActiveSize(null)
    setActiveColor(null)
  }

  const filtersApplied =
    activeCategory !== "all" || query !== "" || activeSize !== null || activeColor !== null

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
              activeCategory === "all"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                activeCategory === cat.slug
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setActiveSize(activeSize === size ? null : size)}
              className={`min-w-10 h-10 px-2 border text-sm transition-colors ${
                activeSize === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(activeColor === color ? null : color)}
              className={`w-7 h-7 rounded-full border-2 transition-colors ${
                activeColor === color ? "border-foreground" : "border-transparent hover:border-foreground"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Filter by ${color}`}
            />
          ))}
        </div>
      </div>

      {filtersApplied && (
        <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-4">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Shop</span>
      </div>

      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light">
            {activeCategory === "all" ? "Shop All" : CATEGORY_LABELS[activeCategory] ?? "Shop"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Premium Zero Limit pieces
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-start gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          {filterContent}
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-background p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-foreground font-medium">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-muted" : ""}`} aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-muted" : ""}`} aria-label="List view">
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
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 border">
              <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-medium mb-2">No products found</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your filters or search.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ListRow product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListRow({ product }: { product: { id: string; slug: string; name: string; price: number; images: string[]; stock: number } }) {
  return (
    <Link href={`/product/${product.slug}`} className="group flex gap-4 border p-4 hover:shadow-lg transition-shadow">
      <div className="w-32 aspect-[3/4] bg-muted overflow-hidden shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="font-medium group-hover:text-primary transition-colors">{product.name}</h4>
        <p className="text-sm font-semibold mt-1">{formatCurrency(product.price)}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="w-fit mt-3 h-8 text-xs rounded-none"
          onClick={(e) => e.preventDefault()}
        >
          <ShoppingBag className="h-3 w-3 mr-1" /> View Product
        </Button>
      </div>
    </Link>
  )
}
