"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/store/product-card"
import { CATEGORIES, SORT_OPTIONS, SIZES } from "@/constants"
import type { Product } from "@/types"

// Mock data - will be replaced with Supabase data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Oversized Hoodie",
    slug: "premium-oversized-hoodie",
    description: "Luxurious oversized hoodie crafted from premium cotton blend",
    price: 45000,
    compare_at_price: 55000,
    images: ["/products/hoodie-1.jpg"],
    category_id: "1",
    collection_id: "1",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#FFFFFF", "#1a1a1a"],
    stock: 25,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    name: "Streetwear Cargo Pants",
    slug: "streetwear-cargo-pants",
    description: "Durable cargo pants with multiple pockets",
    price: 35000,
    images: ["/products/cargo-1.jpg"],
    category_id: "2",
    collection_id: "1",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#000000", "#556B2F", "#8B4513"],
    stock: 30,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "3",
    name: "Minimalist White Tee",
    slug: "minimalist-white-tee",
    description: "Clean and crisp white t-shirt",
    price: 18000,
    images: ["/products/tee-1.jpg"],
    category_id: "3",
    collection_id: "2",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FFFFFF", "#000000"],
    stock: 50,
    is_featured: false,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "4",
    name: "Luxury Bomber Jacket",
    slug: "luxury-bomber-jacket",
    description: "Premium bomber jacket with satin lining",
    price: 85000,
    compare_at_price: 95000,
    images: ["/products/jacket-1.jpg"],
    category_id: "4",
    collection_id: "2",
    sizes: ["M", "L", "XL"],
    colors: ["#000000", "#000080"],
    stock: 15,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "5",
    name: "Essential Sneakers",
    slug: "essential-sneakers",
    description: "Comfortable everyday sneakers",
    price: 42000,
    images: ["/products/sneakers-1.jpg"],
    category_id: "5",
    collection_id: "3",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["#FFFFFF", "#000000"],
    stock: 40,
    is_featured: false,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "6",
    name: "Designer Cap",
    slug: "designer-cap",
    description: "Structured cap with embroidered logo",
    price: 12000,
    images: ["/products/cap-1.jpg"],
    category_id: "6",
    collection_id: "3",
    sizes: ["One Size"],
    colors: ["#000000", "#FFFFFF", "#FF0000"],
    stock: 60,
    is_featured: false,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

export default function ShopPage() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesSize = selectedSizes.length === 0 || product.sizes.some(s => selectedSizes.includes(s))
    return matchesSearch && matchesCategory && matchesSize
  })

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground mt-1">
            Discover our premium collection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left text-sm py-1 ${
                    !selectedCategory ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`block w-full text-left text-sm py-1 ${
                      selectedCategory === category.slug
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      selectedSizes.includes(size)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || selectedSizes.length > 0) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedSizes([])
                }}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
