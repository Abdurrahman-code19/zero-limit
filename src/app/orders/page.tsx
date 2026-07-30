"use client"

import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ORDERS = [
  { id: "ORD-001", date: "2026-07-20", total: 434, status: "Delivered", items: 3 },
  { id: "ORD-002", date: "2026-07-15", total: 165, status: "Shipped", items: 1 },
  { id: "ORD-003", date: "2026-07-10", total: 289, status: "Processing", items: 2 },
  { id: "ORD-004", date: "2026-07-05", total: 520, status: "Pending Payment", items: 4 },
]

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Delivered": "secondary",
  "Shipped": "default",
  "Processing": "default",
  "Pending Payment": "outline",
  "Cancelled": "destructive",
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Orders</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {ORDERS.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No orders yet</h2>
          <p className="text-sm text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link href="/shop">
            <span className="text-sm text-primary hover:underline">Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ORDERS.map((order) => (
            <Link key={order.id} href="/orders" className="block border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-sm">{order.id}</p>
                    <Badge variant={statusColor[order.status] || "outline"} className="text-[10px] uppercase tracking-wider">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{order.date} &middot; {order.items} item{order.items > 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">${order.total}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
