"use client"

import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/utils"

// Mock data
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
    title: "Products",
    value: 48,
    change: 4.1,
    icon: Package,
    format: "number" as const,
  },
  {
    title: "Customers",
    value: 892,
    change: 15.3,
    icon: Users,
    format: "number" as const,
  },
]

const recentOrders = [
  { id: "ZL-001", customer: "John Doe", total: 90000, status: "delivered", date: "2024-01-28" },
  { id: "ZL-002", customer: "Jane Smith", total: 35000, status: "shipped", date: "2024-01-27" },
  { id: "ZL-003", customer: "Mike Johnson", total: 85000, status: "processing", date: "2024-01-26" },
  { id: "ZL-004", customer: "Sarah Williams", total: 18000, status: "pending", date: "2024-01-25" },
  { id: "ZL-005", customer: "Chris Brown", total: 45000, status: "delivered", date: "2024-01-24" },
]

const topProducts = [
  { name: "Premium Oversized Hoodie", sold: 45, revenue: 2025000 },
  { name: "Streetwear Cargo Pants", sold: 38, revenue: 1330000 },
  { name: "Luxury Bomber Jacket", sold: 22, revenue: 1870000 },
  { name: "Minimalist White Tee", sold: 56, revenue: 1008000 },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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

      {/* Stats Grid */}
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
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <a href="/admin/orders" className="text-sm text-primary hover:underline">
              View All
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sold} sold
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">
                Connect to a charting library to visualize data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
