"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, ShoppingBag, Lock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { formatCurrency } from "@/utils"
import { PaystackButton } from "@/components/checkout/paystack-button"

export default function CheckoutPage() {
  const { items, getTotal, getItemCount, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [paidReference, setPaidReference] = useState<string | null>(null)

  const subtotal = getTotal()
  const shipping = subtotal >= 50000 ? 0 : 2500
  const total = subtotal + shipping

  const handlePay = () => {
    setFormError(null)
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.")
      return
    }
    if (!/^[+0-9\s-]{7,15}$/.test(phone)) {
      setFormError("Please enter a valid phone number.")
      return
    }
    if (!address.trim() || !city.trim() || !state.trim()) {
      setFormError("Please complete your delivery address.")
      return
    }
    return true
  }

  if (!mounted) {
    return <div className="min-h-[60vh]" />
  }

  if (paidReference) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-light">Payment Successful</h1>
          <p className="text-muted-foreground">
            Your order has been received. Reference:{" "}
            <span className="text-foreground font-medium">
              {paidReference}
            </span>
          </p>
          <div className="border p-4 text-left space-y-1 text-sm text-muted-foreground">
            <p>
              Order total:{" "}
              <span className="text-foreground font-medium">
                {formatCurrency(total)}
              </span>
            </p>
            <p>
              Items:{" "}
              <span className="text-foreground font-medium">
                {getItemCount()}
              </span>
            </p>
          </div>
          <Link href="/store" className="block">
            <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-10 py-6">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-light">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Add some items before heading to checkout.
        </p>
        <Link href="/store" className="block">
          <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-10 py-6">
            Explore Collection
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
        <Link href="/cart" className="hover:text-foreground">
          Cart
        </Link>
        <span>/</span>
        <span className="text-foreground">Checkout</span>
      </div>

      <h1 className="text-3xl font-light mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Shipping form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="border p-6">
            <h2 className="font-semibold tracking-wider uppercase text-sm mb-5">
              Delivery Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Delivery Address
              </label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House number, street, landmark…"
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lagos"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Lagos"
                  required
                />
              </div>
            </div>
          </section>

          <section className="border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4" />
              <h2 className="font-semibold tracking-wider uppercase text-sm">
                Payment
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Pay securely with Paystack. You will be redirected to a secure
              payment window after placing your order.
            </p>
            {formError && (
              <div className="mb-5 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{formError}</p>
              </div>
            )}
            <PaystackButton
              email={email || "pending@checkout.com"}
              amount={total}
              onSuccess={(reference) => {
                clearCart()
                setPaidReference(reference)
              }}
            />
          </section>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border p-6 lg:sticky lg:top-24 space-y-4">
            <h2 className="font-semibold tracking-wider uppercase text-sm">
              Order Summary
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="relative w-14 h-[72px] bg-muted shrink-0 overflow-hidden">
                    <img
                      src={item.product.images[0] ?? "/favicon.png"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} / {item.color} × {item.quantity}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Truck className="h-3.5 w-3.5" />
              {shipping === 0
                ? "You qualify for free delivery"
                : `Add ${formatCurrency(50000 - subtotal)} more for free delivery`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
