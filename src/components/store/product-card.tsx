"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/utils"
import type { Product } from "@/types"
import { useCartStore } from "@/store/cart"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, 1, product.sizes[0], product.colors[0])
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement wishlist functionality
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {hasDiscount && (
              <Badge variant="destructive">-{discountPercent}%</Badge>
            )}
            {product.is_featured && (
              <Badge>Featured</Badge>
            )}
            {product.stock <= 0 && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compare_at_price!)}
              </span>
            )}
          </div>
          {product.colors.length > 0 && (
            <div className="flex gap-1 mt-2">
              {product.colors.slice(0, 5).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
