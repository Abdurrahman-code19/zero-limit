"use client"

import { useState } from "react"
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/utils"

// Mock orders data
const mockOrders = [
  {
    id: "ZL-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 90000,
    items: 2,
    status: "delivered",
    date: "2024-01-28",
    payment: "paid",
  },
  {
    id: "ZL-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 35000,
    items: 1,
    status: "shipped",
    date: "2024-01-27",
    payment: "paid",
  },
  {
    id: "ZL-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 85000,
    items: 1,
    status: "processing",
    date: "2024-01-26",
    payment: "paid",
  },
  {
    id: "ZL-004",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    total: 18000,
    items: 1,
    status: "pending",
    date: "2024-01-25",
    payment: "pending",
  },
  {
    id: "ZL-005",
    customer: "Chris Brown",
    email: "chris@example.com",
    total: 45000,
    items: 1,
    status: "cancelled",
    date: "2024-01-24",
    payment: "refunded",
  },
]

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "warning" as const },
  processing: { label: "Processing", icon: Package, variant: "secondary" as const },
  shipped: { label: "Shipped", icon: Truck, variant: "default" as const },
  delivered: { label: "Delivered", icon: CheckCircle, variant: "success" as const },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [orders] = useState(mockOrders)

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <config.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                </div>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon

                  return (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <p className="font-medium">{order.id}</p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{order.items}</td>
                      <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
                      <td className="p-4">
                        <Badge variant={status.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            order.payment === "paid"
                              ? "success"
                              : order.payment === "refunded"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {order.payment}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(order.date)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
