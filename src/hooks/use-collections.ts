"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("collections")
      .select("id, name, slug, description, image_url, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name")
      .then(({ data }) => {
        if (data) setCollections(data)
        setLoading(false)
      })
  }, [])

  return { collections, loading }
}
