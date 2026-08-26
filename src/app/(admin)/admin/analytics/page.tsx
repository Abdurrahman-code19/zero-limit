"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, ShoppingCart, Users, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface DailyData {
  date: string
  label: string
  revenue: number
  orders: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    avgOrderValue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  })
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const since = thirtyDaysAgo.toISOString()

      const [ordersRes, customersRes, productsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("total, status, created_at")
          .gte("created_at", since),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "customer"),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true }),
      ])

      const orders = ordersRes.data ?? []
      const revenue = orders
        .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
        .reduce((sum, o) => sum + (o.total ?? 0), 0)
      const delivered = orders.filter((o) => o.status === "delivered").length
      const pending = orders.filter((o) => o.status === "pending").length

      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalCustomers: customersRes.count ?? 0,
        totalProducts: productsRes.count ?? 0,
        avgOrderValue: orders.length > 0 ? revenue / orders.length : 0,
        deliveredOrders: delivered,
        pendingOrders: pending,
      })

      const grouped: Record<string, { revenue: number; orders: number }> = {}
      const today = new Date()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split("T")[0]
        grouped[key] = { revenue: 0, orders: 0 }
      }

      for (const order of orders) {
        if (!order.created_at) continue
        const key = order.created_at.split("T")[0]
        if (!grouped[key]) grouped[key] = { revenue: 0, orders: 0 }
        grouped[key].orders += 1
        if (order.status !== "cancelled" && order.status !== "refunded") {
          grouped[key].revenue += order.total ?? 0
        }
      }

      const chartData: DailyData[] = Object.entries(grouped).map(
        ([date, data]) => {
          const d = new Date(date + "T00:00:00")
          const label = d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          })
          return { date, label, ...data }
        }
      )

      setDailyData(chartData)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded" />
          ))}
        </div>
        <div className="h-64 animate-pulse bg-muted rounded" />
        <div className="h-64 animate-pulse bg-muted rounded" />
      </div>
    )
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(stats.avgOrderValue),
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-yellow-600",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-muted-foreground",
    },
  ]

  const formatNaira = (value: number) =>
    `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Store performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-8 w-8 ${card.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {card.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNaira} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [formatNaira(value), "Revenue"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Count (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "Orders"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
