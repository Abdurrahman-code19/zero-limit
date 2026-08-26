"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { SlidersHorizontal, Grid3X3, List, Heart, X, Search, ShoppingBag, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/store/product-card"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { formatCurrency } from "@/utils"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
]

const COLOR_NAME_MAP: Record<string, string> = {
  "#000000": "Black",
  "#ffffff": "White",
  "#f5f5f5": "Off White",
  "#fafafa": "Snow White",
  "#1a1a2e": "Dark Navy",
  "#16213e": "Navy Blue",
  "#0f3460": "Royal Blue",
  "#1b1b2f": "Midnight",
  "#2d2d2d": "Charcoal",
  "#333333": "Dark Grey",
  "#555555": "Grey",
  "#808080": "Medium Grey",
  "#999999": "Silver Grey",
  "#c0c0c0": "Light Grey",
  "#d3d3d3": "Pale Grey",
  "#e0e0e0": "Pearl Grey",
  "#f0f0f0": "Cloud",
  "#b0b0b0": "Ash Grey",
  "#4a4a4a": "Gunmetal",
  "#3d3d3d": "Graphite",
  "#ff0000": "Red",
  "#dc143c": "Crimson",
  "#cc0000": "Dark Red",
  "#8b0000": "Maroon",
  "#b22222": "Firebrick",
  "#ff4444": "Bright Red",
  "#ff6b6b": "Coral Red",
  "#c0392b": "Rust Red",
  "#e74c3c": "Vermillion",
  "#ff6347": "Tomato",
  "#0000ff": "Blue",
  "#0066cc": "Ocean Blue",
  "#007bff": "Dodger Blue",
  "#1e90ff": "Sky Blue",
  "#4169e1": "Royal Blue",
  "#3498db": "Cerulean",
  "#2980b9": "Steel Blue",
  "#0047ab": "Cobalt Blue",
  "#002366": "Dark Blue",
  "#5dade2": "Light Blue",
  "#87ceeb": "Baby Blue",
  "#add8e6": "Powder Blue",
  "#00ff00": "Green",
  "#008000": "Green",
  "#228b22": "Forest Green",
  "#2ecc71": "Emerald",
  "#27ae60": "Jade",
  "#006400": "Dark Green",
  "#556b2f": "Olive",
  "#6b8e23": "Army Green",
  "#9acd32": "Yellow Green",
  "#8fbc8f": "Sea Green",
  "#ffd700": "Gold",
  "#ffcc00": "Yellow",
  "#ffff00": "Yellow",
  "#ffa500": "Orange",
  "#ff8c00": "Dark Orange",
  "#ff4500": "Orange Red",
  "#e67e22": "Burnt Orange",
  "#d35400": "Pumpkin",
  "#f39c12": "Amber",
  "#ffb347": "Peach Orange",
  "#ff00ff": "Magenta",
  "#800080": "Purple",
  "#9b59b6": "Amethyst",
  "#8e44ad": "Deep Purple",
  "#6c3483": "Dark Purple",
  "#4b0082": "Indigo",
  "#7b2d8e": "Plum",
  "#dda0dd": "Lavender",
  "#e6e6fa": "Pale Lavender",
  "#ffc0cb": "Pink",
  "#ff69b4": "Hot Pink",
  "#ff1493": "Deep Pink",
  "#db7093": "Pale Violet Red",
  "#c71585": "Medium Violet Red",
  "#e91e63": "Rose",
  "#f08080": "Light Coral",
  "#cd5c5c": "Indian Red",
  "#a52a2a": "Brown",
  "#8b4513": "Saddle Brown",
  "#d2691e": "Chocolate",
  "#deb887": "Burlywood",
  "#f4a460": "Sandy Brown",
  "#bc8f8f": "Rosy Brown",
  "#d2b48c": "Tan",
  "#c19a6b": "Camel",
  "#8b6914": "Dark Goldenrod",
  "#bdb76b": "Dark Khaki",
  "#00ced1": "Teal",
  "#008080": "Teal",
  "#20b2aa": "Light Teal",
  "#40e0d0": "Turquoise",
  "#48d1cc": "Medium Turquoise",
  "#00ffff": "Cyan",
  "#e0ffff": "Ice Blue",
}

function getColorName(hex: string): string {
  const lower = hex.toLowerCase().trim()
  if (COLOR_NAME_MAP[lower]) return COLOR_NAME_MAP[lower]
  return hex
}

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
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false)
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false)
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")

  const { products: dbProducts, loading } = useProducts()
  const { categories: dbCategories } = useCategories()
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
    const productCategoryIds = new Set(available.map((p) => p.category_id))
    return dbCategories.filter((c) => productCategoryIds.has(c.slug))
  }, [available, dbCategories])

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

    if (priceMin) {
      result = result.filter((p) => p.price >= Number(priceMin))
    }
    if (priceMax) {
      result = result.filter((p) => p.price <= Number(priceMax))
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
  }, [available, activeCategory, query, activeSize, activeColor, sortBy, priceMin, priceMax])

  const clearFilters = () => {
    setActiveCategory("all")
    setQuery("")
    setActiveSize(null)
    setActiveColor(null)
    setPriceMin("")
    setPriceMax("")
  }

  const filtersApplied =
    activeCategory !== "all" || query !== "" || activeSize !== null || activeColor !== null || priceMin !== "" || priceMax !== ""

  const sidebarContent = (
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
        <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
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
            {activeCategory === "all" ? "Shop All" : dbCategories.find((c) => c.slug === activeCategory)?.name ?? "Shop"}
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

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <button
            onClick={() => { setSizeDropdownOpen(!sizeDropdownOpen); setColorDropdownOpen(false) }}
            className="flex items-center gap-2 px-4 py-2 border text-sm rounded transition-colors hover:border-foreground"
          >
            Size {activeSize ? `: ${activeSize}` : ""}
            <ChevronDown className={`h-3 w-3 transition-transform ${sizeDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {sizeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-background border rounded shadow-lg z-40 min-w-[120px]">
              <button
                onClick={() => { setActiveSize(null); setSizeDropdownOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${!activeSize ? "bg-muted font-medium" : "hover:bg-muted"}`}
              >
                All Sizes
              </button>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { setActiveSize(activeSize === size ? null : size); setSizeDropdownOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeSize === size ? "bg-muted font-medium" : "hover:bg-muted"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setColorDropdownOpen(!colorDropdownOpen); setSizeDropdownOpen(false) }}
            className="flex items-center gap-2 px-4 py-2 border text-sm rounded transition-colors hover:border-foreground"
          >
            Color {activeColor ? `: ${getColorName(activeColor)}` : ""}
            <ChevronDown className={`h-3 w-3 transition-transform ${colorDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {colorDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-background border rounded shadow-lg z-40 min-w-[160px] max-h-72 overflow-y-auto">
              <button
                onClick={() => { setActiveColor(null); setColorDropdownOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${!activeColor ? "bg-muted font-medium" : "hover:bg-muted"}`}
              >
                All Colors
              </button>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => { setActiveColor(activeColor === color ? null : color); setColorDropdownOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3 ${activeColor === color ? "bg-muted font-medium" : "hover:bg-muted"}`}
                >
                  <span
                    className="w-4 h-4 rounded-full border shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {getColorName(color)}
                </button>
              ))}
            </div>
          )}
        </div>

        {(activeSize || activeColor) && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {(sizeDropdownOpen || colorDropdownOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setSizeDropdownOpen(false); setColorDropdownOpen(false) }} />
      )}

      <div className="flex items-start gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          {sidebarContent}
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
              {sidebarContent}
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
