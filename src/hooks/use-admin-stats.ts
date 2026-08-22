"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/types"

interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  lowStockProducts: { name: string; stock: number; category: string; slug: string }[]
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchStats() {
      const [ordersRes, productsRes, customersRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("id, order_number, total, status, created_at"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("name, slug, stock_quantity, categories(name)")
          .eq("is_active", true)
          .lte("stock_quantity", 5)
          .order("stock_quantity", { ascending: true })
          .limit(10),
      ])

      const orders = (ordersRes.data ?? []) as { id: string; order_number: string; total: number; status: string; created_at: string }[]
      const totalRevenue = orders
        .filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status))
        .reduce((sum, o) => sum + (o.total ?? 0), 0)

      const recentOrders: Order[] = orders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map((o) => ({
          id: o.id,
          order_number: o.order_number ?? o.id,
          user_id: "",
          status: o.status as Order["status"],
          total: o.total,
          subtotal: o.total,
          shipping_cost: 0,
          discount: 0,
          shipping_address: { label: "", first_name: "", last_name: "", address: "", city: "", state: "", phone: "" },
          payment_method: "paystack",
          payment_reference: "",
          created_at: o.created_at,
          updated_at: o.created_at,
        }))

      const lowStock = (lowStockRes.data ?? []).map((p: any) => ({
        name: p.name,
        stock: p.stock_quantity,
        category: p.categories?.name ?? "Uncategorized",
        slug: p.slug,
      }))

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsRes.count ?? 0,
        totalCustomers: customersRes.count ?? 0,
        recentOrders,
        lowStockProducts: lowStock,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
