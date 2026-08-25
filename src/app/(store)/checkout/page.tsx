"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  Lock,
  Truck,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { formatCurrency } from "@/utils"
import { PaystackButton } from "@/components/checkout/paystack-button"
import { createClient } from "@/lib/supabase/client"

interface PaymentData {
  reference: string
  amount: number
  currency: string
  channel: string
  paid_at: string
  customer_email: string
}

interface OrderData {
  order_id: string
  order_number: string
  total: number
}

export default function CheckoutPage() {
  const { items, getTotal, getItemCount, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const subtotal = getTotal()
  const shipping = subtotal >= 50000 ? 0 : 2500
  const total = subtotal + shipping

  const handleFormValidation = () => {
    setFormError(null)
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name.")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.")
      return false
    }
    if (!/^[+0-9\s-]{7,15}$/.test(phone)) {
      setFormError("Please enter a valid phone number.")
      return false
    }
    if (!address.trim() || !city.trim() || !state.trim()) {
      setFormError("Please complete your delivery address.")
      return false
    }
    return true
  }

  const handlePaymentSuccess = async (reference: string) => {
    setVerifying(true)
    setVerifyError(null)
    try {
      // Step 1: Verify payment with Paystack
      const verifyRes = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      })
      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.status) {
        setVerifyError(
          verifyData.error || "Payment verification failed. Contact support."
        )
        setVerifying(false)
        return
      }

      // Step 2: Persist order to database
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            unit_price: item.product.price,
          })),
          shipping: {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            address,
            city,
            state,
          },
          subtotal,
          shipping_cost: shipping,
          total,
          payment_reference: reference,
          payment_method: verifyData.data.channel || "paystack",
        }),
      })
      const orderDataRes = await orderRes.json()

      if (!orderRes.ok) {
        // Payment succeeded but order persist failed — still show success
        // but note the issue
        console.error("Order persist failed:", orderDataRes.error)
        setPaymentData(verifyData.data)
        setVerifying(false)
        return
      }

      clearCart()
      setPaymentData(verifyData.data)
      setOrderData(orderDataRes.data)
    } catch {
      setVerifyError("Could not verify payment. Contact support with your reference.")
      setVerifying(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-[60vh]" />
  }

  if (verifying) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="space-y-6">
          <Loader2 className="h-10 w-10 mx-auto animate-spin text-muted-foreground" />
          <h1 className="text-2xl font-light">Verifying payment…</h1>
          <p className="text-muted-foreground text-sm">
            Please don&apos;t close this page.
          </p>
        </div>
      </div>
    )
  }

  if (paymentData) {
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
          <h1 className="text-3xl font-light">Order Confirmed</h1>
          <p className="text-muted-foreground">
            Thank you, {firstName}! Your order has been placed successfully.
          </p>
          <div className="border p-6 text-left space-y-3 text-sm">
            {orderData && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-mono font-medium">
                  {orderData.order_number}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono font-medium">
                {paymentData.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium">
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">
                {paymentData.channel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{getItemCount()}</span>
            </div>
            <Separator />
            <div>
              <span className="text-muted-foreground block mb-1">
                Delivery Address
              </span>
              <span className="text-foreground">
                {firstName} {lastName}
                <br />
                {address}
                <br />
                {city}, {state}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            A confirmation will be sent to{" "}
            <span className="text-foreground">{email}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/orders" className="block">
              <Button variant="outline" className="text-xs tracking-widest uppercase rounded-none px-10 py-6">
                View My Orders
              </Button>
            </Link>
            <Link href="/store" className="block">
              <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase rounded-none px-10 py-6">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
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
              <div className="mb-5 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-500">{formError}</p>
              </div>
            )}
            {verifyError && (
              <div className="mb-5 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-500">{verifyError}</p>
              </div>
            )}
            <PaystackButton
              email={email}
              amount={total}
              beforePay={handleFormValidation}
              onSuccess={handlePaymentSuccess}
              metadata={{
                user_id: userId,
                shipping_address: { first_name: firstName, last_name: lastName, address, city, state, phone, shipping_cost: shipping, subtotal },
                items: items.map((item) => ({
                  product_id: item.product.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color,
                  unit_price: item.product.price,
                })),
                total,
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
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-3"
                >
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
