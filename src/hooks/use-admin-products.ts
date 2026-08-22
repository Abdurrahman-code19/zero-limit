"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
    id: db.id,
    name: db.name,
    slug: db.slug,
    description: db.description ?? "",
    price: db.price,
    compare_at_price: db.compare_at_price ?? undefined,
    images: db.images ?? [],
    category_id: db.categories?.slug ?? db.category_id,
    sizes: sizes.length > 0 ? sizes : ["One Size"],
    colors: colors.length > 0 ? colors : ["#111111"],
    stock: db.stock_quantity,
    is_featured: db.is_featured,
    is_published: db.is_active,
    created_at: db.created_at,
    updated_at: db.updated_at,
  }
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProducts() {
      const [productsRes, variantsRes] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(slug)")
          .order("created_at", { ascending: false }),
        supabase
          .from("product_variants")
          .select("product_id, size, color")
          .eq("is_active", true),
      ])

      if (productsRes.error || variantsRes.error) {
        console.error("Failed to fetch admin products:", productsRes.error ?? variantsRes.error)
        setLoading(false)
        return
      }

      const dbProducts = (productsRes.data ?? []) as unknown as DBProduct[]
      const dbVariants = (variantsRes.data ?? []) as DBVariant[]

      const mapped = dbProducts.map((p) => mapProduct(p, dbVariants))
      setProducts(mapped)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  async function deleteProduct(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
    return { error }
  }

  async function toggleProductStatus(id: string, is_active: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from("products").update({ is_active, updated_at: new Date().toISOString() }).eq("id", id)
    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_published: is_active } : p
        )
      )
    }
    return { error }
  }

  return { products, loading, deleteProduct, toggleProductStatus }
}
