"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/utils"

interface OrderRow {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  order_items: { id: string; quantity: number }[]
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setUserEmail(user.email ?? null)

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at, order_items(id, quantity)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setOrders(data || [])
      }
      setLoading(false)
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-lg font-medium mb-2">Sign in to view your orders</h2>
        <Link href="/login">
          <span className="text-sm text-primary hover:underline">Sign In</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Orders</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No orders yet</h2>
          <p className="text-sm text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link href="/store">
            <span className="text-sm text-primary hover:underline">Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border rounded-lg p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-sm">{order.order_number}</p>
                    <Badge
                      variant={statusColor[order.status] || "outline"}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)} &middot;{" "}
                    {order.order_items?.length ?? 0} item{(order.order_items?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
