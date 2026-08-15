"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  ArrowRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { formatCurrency } from "@/utils"
import {
  getProductBySlug,
  getRelatedProducts,
  getProductTags,
} from "@/lib/products"

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const product = useMemo(() => getProductBySlug(slug), [slug])

  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id ?? ""))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const [mounted, setMounted] = useState(false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <h1 className="text-3xl font-light">Product not found</h1>
        <p className="text-muted-foreground">
          The item you are looking for does not exist or has been removed.
        </p>
        <Link href="/store">
          <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-8 py-6">
            Back to Store
          </Button>
        </Link>
      </div>
    )
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const tags = getProductTags(product)
  const related = getRelatedProducts(product)
  const defaultColor = color ?? product.colors[0]
  const defaultSize = size ?? product.sizes[0]

  const handleAddToCart = () => {
    addItem(product, quantity, defaultSize, defaultColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/store" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[3/4] bg-muted overflow-hidden"
        >
          <img
            src={product.images[0] ?? "/favicon.png"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {tags.length > 0 && (
            <Badge className="absolute top-4 left-4 z-10 bg-foreground text-background text-[10px] tracking-wider uppercase rounded-none">
              {tags[0]}
            </Badge>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.8 (42 reviews)
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-light mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
                <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 uppercase tracking-wider">
                  Save{" "}
                  {formatCurrency(product.compare_at_price - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">
              Size <span className="text-muted-foreground font-normal">— {defaultSize}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 h-12 px-3 border text-sm transition-colors ${
                    defaultSize === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-8">
            <p className="text-sm font-medium mb-3">Colour</p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-transform ${
                    defaultColor === c
                      ? "border-foreground scale-110"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Colour ${c}`}
                >
                  {defaultColor === c && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white mix-blend-difference" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Quantity + Add to cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border rounded-none w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 hover:bg-muted transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 hover:bg-muted transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-8 py-6 h-auto"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-14 h-auto rounded-none"
              aria-label={mounted && isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-4 w-4 ${mounted && isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4" /> Free delivery on orders over{" "}
              {formatCurrency(50000)} · Nationwide 2-5 days
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4" /> 7-day hassle-free returns
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4" /> Secure checkout with Paystack
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related products */}
      <section className="mt-20 md:mt-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              You May Also Like
            </p>
            <h2 className="text-2xl md:text-3xl font-light">Related Products</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group"
          >
            View All
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block">
              <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <h4 className="text-sm font-medium mb-1 group-hover:text-muted-foreground transition-colors">
                {p.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(p.price)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
