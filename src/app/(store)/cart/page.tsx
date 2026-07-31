"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { formatCurrency } from "@/utils"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore()

  const subtotal = getTotal()
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 2500
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-light">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Looks like you haven&apos;t added anything yet. Explore the collection
          and find your next favourite piece.
        </p>
        <Link href="/store" className="block">
          <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-10 py-6">
            Explore Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/store" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">Cart</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light">
          Your Cart{" "}
          <span className="text-muted-foreground text-xl">
            ({getItemCount()})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={`${item.product.id}-${item.size}-${item.color}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-4 border"
            >
              <Link
                href={`/product/${item.product.slug}`}
                className="relative w-24 h-32 bg-muted shrink-0 overflow-hidden"
              >
                <img
                  src={item.product.images[0] ?? "/favicon.png"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-medium text-sm hover:underline line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() =>
                      removeItem(item.product.id, item.size, item.color)
                    }
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Size: {item.size} / Colour: {item.color}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-1.5 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1.5 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border p-6 lg:sticky lg:top-24 space-y-4">
            <h2 className="font-semibold tracking-wider uppercase text-sm">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Link href="/checkout" className="block">
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none py-6">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/store"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
