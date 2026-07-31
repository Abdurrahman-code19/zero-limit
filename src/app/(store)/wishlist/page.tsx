"use client"

import Link from "next/link"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const SAVED_ITEMS = [
  { id: 1, name: "Minimalist Tailored Blazer", price: 289, inStock: true },
  { id: 2, name: "Urban Classic Sneakers", price: 165, inStock: false },
  { id: 3, name: "Signature Crossbody Bag", price: 195, inStock: true },
]

export default function WishlistPage() {
  const [items, setItems] = useState(SAVED_ITEMS)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Wishlist</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{items.length} items saved</p>

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
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex gap-4">
              <div className="w-24 h-24 bg-muted rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                <p className="text-sm font-semibold mb-2">${item.price}</p>
                {item.inStock ? (
                  <p className="text-xs text-green-600 mb-3">In Stock</p>
                ) : (
                  <p className="text-xs text-destructive mb-3">Out of Stock</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs" disabled={!item.inStock}>
                    <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => setItems(items.filter(i => i.id !== item.id))}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
