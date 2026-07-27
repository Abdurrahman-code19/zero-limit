"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { formatCurrency } from "@/utils"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } =
    useCartStore()
  const subtotal = getTotal()
  const shipping = subtotal >= 50000 ? 0 : 2500

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-background border-l shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              Cart ({getItemCount()})
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add items to get started
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    onClose()
                    window.location.href = "/shop"
                  }}
                >
                  Browse Shop
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-20 h-24 bg-muted rounded-md overflow-hidden shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-medium text-sm line-clamp-1 hover:underline"
                          onClick={onClose}
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.size,
                              item.color
                            )
                          }
                          className="text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} / {item.color}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-0.5 hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-0.5 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-0.5 hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(
                            item.product.price * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t px-6 py-4 space-y-3">
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
                <span>{formatCurrency(subtotal + shipping)}</span>
              </div>
              <Link href="/checkout" className="block" onClick={onClose}>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </Link>
              <Link
                href="/cart"
                className="block text-center text-sm text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                View Full Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
