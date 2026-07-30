"use client"

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  Eye,
  CreditCard,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/utils"

const stats = [
  {
    title: "Total Revenue",
    value: 2450000,
    change: 12.5,
    icon: DollarSign,
    format: "currency" as const,
  },
  {
    title: "Total Orders",
    value: 156,
    change: 8.2,
    icon: ShoppingCart,
    format: "number" as const,
  },
  {
    title: "Total Customers",
    value: 892,
    change: 15.3,
    icon: Users,
    format: "number" as const,
  },
  {
    title: "Total Products",
    value: 48,
    change: 4.1,
    icon: Package,
    format: "number" as const,
  },
]

const recentOrders = [
  { id: "ZL-001", customer: "John Doe", total: 90000, status: "delivered", date: "2024-01-28" },
  { id: "ZL-002", customer: "Jane Smith", total: 35000, status: "shipped", date: "2024-01-27" },
  { id: "ZL-003", customer: "Mike Johnson", total: 85000, status: "processing", date: "2024-01-26" },
  { id: "ZL-004", customer: "Sarah Williams", total: 18000, status: "pending", date: "2024-01-25" },
  { id: "ZL-005", customer: "Chris Brown", total: 45000, status: "delivered", date: "2024-01-24" },
  { id: "ZL-006", customer: "Emily Davis", total: 72000, status: "processing", date: "2024-01-23" },
]

const lowStockProducts = [
  { name: "Luxury Bomber Jacket", stock: 3, threshold: 10, category: "Jackets" },
  { name: "Essential Sneakers", stock: 0, threshold: 15, category: "Footwear" },
  { name: "Premium Oversized Hoodie", stock: 5, threshold: 20, category: "Hoodies" },
  { name: "Slim Fit Denim Jeans", stock: 2, threshold: 12, category: "Pants" },
]

const recentActivity = [
  { action: "New order placed", detail: "ZL-007 by Alex Turner", time: "5 minutes ago" },
  { action: "Product updated", detail: "Premium Oversized Hoodie price changed", time: "1 hour ago" },
  { action: "New user registered", detail: "Taylor Swift created an account", time: "2 hours ago" },
  { action: "Order shipped", detail: "ZL-004 marked as shipped", time: "3 hours ago" },
  { action: "Review submitted", detail: "5-star review on Streetwear Cargo Pants", time: "5 hours ago" },
]

const statusBadge: Record<string, "success" | "secondary" | "warning" | "default" | "destructive"> = {
  delivered: "success",
  shipped: "default",
  processing: "secondary",
  pending: "warning",
  cancelled: "destructive",
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {stat.format === "currency"
                        ? formatCurrency(stat.value)
                        : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  {stat.change > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={stat.change > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Analytics</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">This Month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg border border-dashed">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground font-medium">Sales Analytics Chart</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Connect a charting library to visualize revenue trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span
                      className={`text-sm font-bold ${
                        product.stock === 0 ? "text-destructive" : "text-amber-500"
                      }`}
                    >
                      {product.stock}
                    </span>
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        product.stock === 0 ? "text-destructive" : "text-amber-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                    <Badge variant={statusBadge[order.status]} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Activity</CardTitle>
            <Badge variant="secondary">Live</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-4 hover:bg-muted/50">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
