"use client"

import { Package, Eye, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/utils"

// Mock orders data
const mockOrders = [
  {
    id: "1",
    order_number: "ZL-001",
    status: "delivered",
    total: 90000,
    items: [
      { name: "Premium Oversized Hoodie", quantity: 2, price: 45000 },
    ],
    created_at: "2024-01-15",
  },
  {
    id: "2",
    order_number: "ZL-002",
    status: "shipped",
    total: 35000,
    items: [
      { name: "Streetwear Cargo Pants", quantity: 1, price: 35000 },
    ],
    created_at: "2024-01-20",
  },
  {
    id: "3",
    order_number: "ZL-003",
    status: "processing",
    total: 85000,
    items: [
      { name: "Luxury Bomber Jacket", quantity: 1, price: 85000 },
    ],
    created_at: "2024-01-25",
  },
  {
    id: "4",
    order_number: "ZL-004",
    status: "pending",
    total: 18000,
    items: [
      { name: "Minimalist White Tee", quantity: 1, price: 18000 },
    ],
    created_at: "2024-01-28",
  },
]

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "warning" as const },
  paid: { label: "Paid", icon: CheckCircle, variant: "success" as const },
  processing: { label: "Processing", icon: Package, variant: "secondary" as const },
  shipped: { label: "Shipped", icon: Truck, variant: "default" as const },
  delivered: { label: "Delivered", icon: CheckCircle, variant: "success" as const },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
            When you place an order, it will appear here.
          </p>
          <Button>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Order {order.order_number}</h3>
                          <Badge variant={status.variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order.created_at)}
                        </p>
                        <div className="mt-2">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm">
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:flex-col md:items-end">
                      <p className="font-semibold">{formatCurrency(order.total)}</p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
