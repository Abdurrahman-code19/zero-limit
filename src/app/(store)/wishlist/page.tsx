"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/types"

// Mock wishlist data
const mockWishlist: Product[] = [
  {
    id: "1",
    name: "Premium Oversized Hoodie",
    slug: "premium-oversized-hoodie",
    description: "Luxurious oversized hoodie",
    price: 45000,
    compare_at_price: 55000,
    images: ["/products/hoodie-1.jpg"],
    category_id: "1",
    collection_id: "1",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000"],
    stock: 25,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    name: "Luxury Bomber Jacket",
    slug: "luxury-bomber-jacket",
    description: "Premium bomber jacket",
    price: 85000,
    images: ["/products/jacket-1.jpg"],
    category_id: "4",
    collection_id: "2",
    sizes: ["M", "L", "XL"],
    colors: ["#000000"],
    stock: 15,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(mockWishlist)

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Save your favorite items to your wishlist.
        </p>
        <Link href="/shop">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Discover Products
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wishlist ({wishlist.length})</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 z-10 p-2 bg-background/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
