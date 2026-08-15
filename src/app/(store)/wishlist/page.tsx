"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { PRODUCTS } from "@/lib/products"
import { formatCurrency } from "@/utils"

export default function WishlistPage() {
  const ids = useWishlistStore((state) => state.ids)
  const remove = useWishlistStore((state) => state.remove)
  const addItem = useCartStore((state) => state.addItem)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-[60vh]" />
  }

  const items = ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p))

  const handleAddToCart = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (product && product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, 1, product.sizes[0], product.colors[0])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Wishlist</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{items.length} {items.length === 1 ? "item" : "items"} saved</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-muted-foreground mb-6">Save items you love to your wishlist</p>
          <Link href="/shop">
            <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-6">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const inStock = item.stock > 0
            return (
              <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                <Link href={`/product/${item.slug}`} className="w-24 h-32 bg-muted rounded shrink-0 overflow-hidden block">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-medium text-sm mb-1 truncate hover:text-primary transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-sm font-semibold mb-2">{formatCurrency(item.price)}</p>
                  {inStock ? (
                    <p className="text-xs text-green-600 mb-3">In Stock</p>
                  ) : (
                    <p className="text-xs text-destructive mb-3">Out of Stock</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      disabled={!inStock}
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => remove(item.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
