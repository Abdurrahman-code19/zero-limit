"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { withRetry } from "@/lib/retry"
import { safeString, safeNumber, safeArray } from "@/lib/safe-data"
import type { Product } from "@/types"

interface DBProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  images: string[]
  category_id: string
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  stock_quantity: number
  tags: string[]
  created_at: string
  updated_at: string
  categories: { slug: string } | null
}

interface DBVariant {
  product_id: string
  size: string | null
  color: string | null
}

function mapProduct(db: DBProduct, variants: DBVariant[]): Product {
  const productVariants = variants.filter((v) => v.product_id === db.id)
  const sizes = [...new Set(productVariants.map((v) => v.size).filter(Boolean))] as string[]
  const colors = [...new Set(productVariants.map((v) => v.color).filter(Boolean))] as string[]

  return {
    id: safeString(db.id, crypto.randomUUID()),
    name: safeString(db.name, "Untitled"),
    slug: safeString(db.slug),
    description: safeString(db.description),
    price: safeNumber(db.price),
    compare_at_price: db.compare_at_price != null ? safeNumber(db.compare_at_price) : undefined,
    images: safeArray<string>(db.images),
    category_id: safeString(db.categories?.slug, safeString(db.category_id)),
    sizes: sizes.length > 0 ? sizes : ["One Size"],
    colors: colors.length > 0 ? colors : ["#111111"],
    stock: safeNumber(db.stock_quantity),
    is_featured: Boolean(db.is_featured),
    is_published: Boolean(db.is_active),
    created_at: safeString(db.created_at),
    updated_at: safeString(db.updated_at),
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProducts() {
      try {
        const [productsRes, variantsRes] = await Promise.all([
          withRetry(() =>
            supabase
              .from("products")
              .select("*, categories(slug)")
              .eq("is_active", true)
              .order("created_at", { ascending: false })
              .then((res) => {
                if (res.error) throw res.error
                return res
              })
          ),
          withRetry(() =>
            supabase
              .from("product_variants")
              .select("product_id, size, color")
              .eq("is_active", true)
              .then((res) => {
                if (res.error) throw res.error
                return res
              })
          ),
        ])

        const dbProducts = (productsRes.data ?? []) as unknown as DBProduct[]
        const dbVariants = (variantsRes.data ?? []) as DBVariant[]

        const mapped = dbProducts.map((p) => mapProduct(p, dbVariants))
        setProducts(mapped)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading }
}
