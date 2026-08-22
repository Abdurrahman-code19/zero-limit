"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/types"

interface DBOrder {
  id: string
  order_number: string
  user_id: string
  status: string
  total: number
  subtotal: number
  shipping_cost: number
  discount: number
  shipping_address: any
  payment_method: string
  payment_reference: string
  created_at: string
  updated_at: string
  profiles: { full_name: string; email: string } | null
}

function mapOrder(db: DBOrder): Order & { customer_name?: string; customer_email?: string } {
  return {
    id: db.id,
    order_number: db.order_number ?? db.id,
    user_id: db.user_id,
    status: db.status as Order["status"],
    total: db.total,
    subtotal: db.subtotal ?? db.total,
    shipping_cost: db.shipping_cost ?? 0,
    discount: db.discount ?? 0,
    shipping_address: db.shipping_address ?? { label: "", first_name: "", last_name: "", address: "", city: "", state: "", phone: "" },
    payment_method: db.payment_method ?? "paystack",
    payment_reference: db.payment_reference ?? "",
    created_at: db.created_at,
    updated_at: db.updated_at,
    customer_name: db.profiles?.full_name ?? "Guest",
    customer_email: db.profiles?.email ?? "",
  }
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<(Order & { customer_name?: string; customer_email?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to fetch orders:", error)
        setLoading(false)
        return
      }

      const mapped = ((data ?? []) as unknown as DBOrder[]).map(mapOrder)
      setOrders(mapped)
      setLoading(false)
    }

    fetchOrders()
  }, [])

  async function updateOrderStatus(id: string, status: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: status as Order["status"] } : o))
      )
    }
    return { error }
  }

  return { orders, loading, updateOrderStatus }
}
