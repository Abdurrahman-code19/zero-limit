"use client"

import { useState } from "react"
import {
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/utils"
import { useAdminOrders } from "@/hooks/use-admin-orders"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "warning" as const },
  paid: { label: "Paid", icon: CheckCircle, variant: "success" as const },
  processing: { label: "Processing", icon: Package, variant: "secondary" as const },
  shipped: { label: "Shipped", icon: Truck, variant: "default" as const },
  delivered: { label: "Delivered", icon: CheckCircle, variant: "success" as const },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
}

const allStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]

export default function AdminOrdersPage() {
  const { orders, loading, updateOrderStatus } = useAdminOrders()
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleStatusUpdate(id: string, newStatus: string) {
    setUpdatingId(id)
    await updateOrderStatus(id, newStatus)
    setUpdatingId(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-12 animate-pulse bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statusCounts = allStatuses.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">{orders.length} orders total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {allStatuses.map((key) => {
          const config = statusConfig[key as keyof typeof statusConfig]
          const StatusIcon = config.icon
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                </div>
                <p className="text-2xl font-bold mt-1">{statusCounts[key]}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {search ? "No orders match your search" : "No orders yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
                    const StatusIcon = status.icon

                    return (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-4">
                          <p className="font-medium">{order.order_number}</p>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
                        <td className="p-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              disabled={updatingId === order.id}
                              className="appearance-none bg-transparent pr-6 text-sm font-medium cursor-pointer disabled:opacity-50"
                            >
                              {allStatuses.map((s) => (
                                <option key={s} value={s}>
                                  {statusConfig[s as keyof typeof statusConfig].label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Badge variant={status.variant} className="text-xs">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
