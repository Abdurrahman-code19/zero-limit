"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types"

export function useAdminCustomers() {
  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchCustomers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to fetch customers:", error)
        setLoading(false)
        return
      }

      const mapped: User[] = (data ?? []).map((p: any) => ({
        id: p.id,
        email: p.email ?? "",
        full_name: p.full_name ?? "Unknown",
        avatar_url: p.avatar_url ?? undefined,
        phone: p.phone ?? undefined,
        role: p.role ?? "customer",
        created_at: p.created_at,
        updated_at: p.updated_at ?? p.created_at,
      }))

      setCustomers(mapped)
      setLoading(false)
    }

    fetchCustomers()
  }, [])

  async function updateCustomerRole(id: string, role: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, role: role as User["role"] } : c))
      )
    }
    return { error }
  }

  return { customers, loading, updateCustomerRole }
}
