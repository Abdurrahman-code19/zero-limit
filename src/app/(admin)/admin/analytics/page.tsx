"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, ShoppingCart, Users, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("total, status"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ])

      const orders = ordersRes.data ?? []
      const revenue = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded").reduce((sum, o) => sum + (o.total ?? 0), 0)
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
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Analytics</h1><div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 animate-pulse bg-muted rounded" />)}</div></div>
  }

  const cards = [
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "text-green-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600" },
    { title: "Avg Order Value", value: formatCurrency(stats.avgOrderValue), icon: BarChart3, color: "text-purple-600" },
    { title: "Delivered Orders", value: stats.deliveredOrders, icon: Package, color: "text-green-600" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: Package, color: "text-yellow-600" },
    { title: "Customers", value: stats.totalCustomers, icon: Users, color: "text-blue-600" },
    { title: "Products", value: stats.totalProducts, icon: Package, color: "text-muted-foreground" },
  ]

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
                    <p className="text-xs text-muted-foreground">{card.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Sales Chart</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Connect a charting library (e.g. Recharts, Chart.js) to visualize revenue trends.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
