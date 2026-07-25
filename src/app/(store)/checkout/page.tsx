"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { formatCurrency } from "@/utils"

type CheckoutStep = "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState<CheckoutStep>("shipping")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = getTotal()
  const shipping = subtotal >= 50000 ? 0 : 2500
  const total = subtotal + shipping

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  })

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setStep("confirmation")
    clearCart()
  }

  if (items.length === 0 && step !== "confirmation") {
    router.push("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}>
            <Truck className="h-5 w-5" />
          </div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className="w-20 h-px bg-muted mx-4" />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}>
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
        <div className="w-20 h-px bg-muted mx-4" />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}>
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="ml-2 font-medium">Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <h2 className="text-xl font-bold">Shipping Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    required
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    required
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  required
                  value={shippingInfo.email}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  type="tel"
                  required
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  required
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    required
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Input
                    required
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continue to Payment
              </Button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Payment</h2>
              <p className="text-muted-foreground">
                You will be redirected to Paystack to complete your payment securely.
              </p>
              
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <CreditCard className="h-8 w-8" />
                  <div>
                    <p className="font-medium">Paystack Secure Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Pay with Card, Bank Transfer, or USSD
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("shipping")}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
                </Button>
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your order. We&apos;ll send you a confirmation email shortly.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Order Number: <span className="font-mono">ZL-{Date.now().toString(36).toUpperCase()}</span>
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/orders")}>
                  View Orders
                </Button>
                <Button variant="outline" onClick={() => router.push("/shop")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {step !== "confirmation" && (
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-60 overflow-auto mb-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-20 bg-muted rounded-md shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} / {item.color} x {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
