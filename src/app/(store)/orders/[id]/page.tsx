"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Package, Truck, CheckCircle, Clock, XCircle, MapPin, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/utils"

interface OrderDetail {
  id: string
  order_number: string
  reference: string | null
  status: string
  payment_status: string
  total: number
  subtotal: number
  shipping_fee: number
  discount: number
  shipping_address: {
    first_name: string
    last_name: string
    address: string
    city: string
    state: string
    phone?: string
  }
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  order_items: {
    id: string
    name: string
    size: string | null
    color: string | null
    price: number
    quantity: number
  }[]
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
]

const statusIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
  refunded: -1,
}

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  delivered: "secondary",
  shipped: "default",
  processing: "default",
  confirmed: "default",
  pending: "outline",
  cancelled: "destructive",
  refunded: "destructive",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [returnSubmitting, setReturnSubmitting] = useState(false)
  const [returnError, setReturnError] = useState<string | null>(null)
  const [returnSuccess, setReturnSuccess] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function fetchOrder() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(id, name, size, color, price, quantity)")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setOrder(data as unknown as OrderDetail)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-lg font-medium">Order not found</h2>
        <Link href="/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  const currentStep = statusIndex[order.status] ?? -1
  const isCancelled = order.status === "cancelled" || order.status === "refunded"
  const canCancel = ["pending", "confirmed"].includes(order.status)

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/orders/${order!.id}/cancel`, {
        method: "PATCH",
      })
      if (res.ok) {
        setOrder({ ...order!, status: "cancelled" })
      }
    } catch { /* ignore */ }
    setCancelling(false)
  }

  async function handleReturnRequest() {
    if (returnReason.length < 10) return
    setReturnSubmitting(true)
    setReturnError(null)
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order!.id, reason: returnReason }),
      })
      if (!res.ok) {
        const data = await res.json()
        setReturnError(data.error || "Failed to submit return request")
        return
      }
      setReturnSuccess(true)
    } catch {
      setReturnError("Network error")
    } finally {
      setReturnSubmitting(false)
    }
  }

  async function handleVerifyPayment() {
    if (!order?.reference) return
    setVerifyingPayment(true)
    try {
      const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(order.reference)}`)
      const data = await res.json()
      if (res.ok && data.status) {
        setOrder({ ...order!, payment_status: data.status })
      }
    } catch { /* ignore */ }
    setVerifyingPayment(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-foreground">Orders</Link>
        <span>/</span>
        <span className="text-foreground">{order.order_number}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <Badge variant={statusColor[order.status] || "outline"} className="text-xs uppercase tracking-wider">
          {order.status}
        </Badge>
      </div>

      {canCancel && (
        <div className="mb-6">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
            Cancel Order
          </Button>
        </div>
      )}

      {order.payment_status === "pending" && (
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyPayment}
            disabled={verifyingPayment}
          >
            {verifyingPayment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Verify Payment
          </Button>
        </div>
      )}

      {/* Tracking Timeline */}
      {!isCancelled && (
        <div className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6">Order Progress</h2>
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
            {/* Active line */}
            <div
              className="absolute top-5 left-0 h-0.5 bg-foreground transition-all duration-500"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {statusSteps.map((step, i) => {
                const StepIcon = step.icon
                const isComplete = i <= currentStep
                return (
                  <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / statusSteps.length}%` }}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isComplete
                          ? "bg-foreground border-foreground text-background"
                          : "bg-background border-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs mt-2 text-center ${isComplete ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          {order.tracking_number && (
            <div className="mt-6 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tracking: <span className="font-mono font-medium">{order.tracking_number}</span></span>
            </div>
          )}
          {order.shipped_at && (
            <p className="text-xs text-muted-foreground mt-2">Shipped on {formatDate(order.shipped_at)}</p>
          )}
          {order.delivered_at && (
            <p className="text-xs text-muted-foreground mt-1">Delivered on {formatDate(order.delivered_at)}</p>
          )}
        </div>
      )}

      {isCancelled && (
        <div className="mb-10 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            <span className="font-medium capitalize">Order {order.status}</span>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Items</h2>
        <div className="border rounded-lg divide-y">
          {order.order_items.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-start">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " · "}
                  {item.color && `Color: ${item.color}`}
                  {" · "}Qty: {item.quantity}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Summary</h2>
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{order.shipping_fee === 0 ? "Free" : formatCurrency(order.shipping_fee)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="mb-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Shipping Address</h2>
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-muted-foreground mt-1">{order.shipping_address.address}</p>
                <p className="text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.state}
                </p>
                {order.shipping_address.phone && (
                  <p className="text-muted-foreground mt-1">{order.shipping_address.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Request */}
      {order.status === "delivered" && (
        <div className="mb-8">
          {showReturnForm ? (
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Request a Return</h2>
              <p className="text-sm text-muted-foreground">Tell us why you would like to return this order. Please provide at least 10 characters.</p>
              {returnError && <p className="text-sm text-red-500">{returnError}</p>}
              {returnSuccess && <p className="text-sm text-green-600">Return request submitted. We will review it shortly.</p>}
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md min-h-[100px]"
                placeholder="e.g. Item doesn't fit, wrong size received, defective product..."
              />
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => { setShowReturnForm(false); setReturnReason(""); setReturnError(null); setReturnSuccess(false) }}>Cancel</Button>
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" disabled={returnSubmitting || returnReason.length < 10} onClick={handleReturnRequest}>
                  {returnSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit Request
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowReturnForm(true)}>
              Request Return
            </Button>
          )}
        </div>
      )}

      <Link href="/orders">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </Link>
    </div>
  )
}
