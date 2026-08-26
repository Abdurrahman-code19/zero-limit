"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("categories")
      .select("id, name, slug, description, image_url, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data)
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}
