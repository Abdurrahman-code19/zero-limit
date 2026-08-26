"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types"

const STORAGE_KEY = "recently-viewed"
const MAX_ITEMS = 6

export function useRecentlyViewed(): Product[] {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  return items
}

export function trackRecentlyViewed(product: Product) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const items: Product[] = stored ? JSON.parse(stored) : []
    const filtered = items.filter((i) => i.id !== product.id)
    filtered.unshift(product)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)))
  } catch { /* ignore */ }
}
