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
  id: string
  product_id: string
  size: string | null
  color: string | null
  stock_quantity: number
}

function mapProduct(db: DBProduct, variants: DBVariant[]): Product {
  const productVariants = variants.filter((v) => v.product_id === db.id)
  const sizes = [...new Set(productVariants.map((v) => v.size).filter(Boolean))] as string[]
  const colors = [...new Set(productVariants.map((v) => v.color).filter(Boolean))] as string[]

  const variant_stock: Record<string, number> = {}
  for (const v of productVariants) {
    const key = `${v.size ?? ""}-${v.color ?? ""}`
    variant_stock[key] = v.stock_quantity
  }

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
    variant_stock: Object.keys(variant_stock).length > 0 ? variant_stock : undefined,
    is_featured: db.is_featured,
    is_published: db.is_active,
    created_at: db.created_at,
    updated_at: db.updated_at,
  }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProduct() {
      const [productRes, variantsRes] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(slug)")
          .eq("slug", slug)
          .single(),
        supabase
          .from("product_variants")
          .select("id, product_id, size, color, stock_quantity")
          .eq("is_active", true),
      ])

      if (productRes.error || !productRes.data) {
        setLoading(false)
        return
      }

      const dbProduct = productRes.data as unknown as DBProduct
      const dbVariants = (variantsRes.data ?? []) as DBVariant[]

      setProduct(mapProduct(dbProduct, dbVariants))
      setLoading(false)
    }

    fetchProduct()
  }, [slug])

  return { product, loading }
}

export function useRelatedProducts(currentProduct: Product | null, count = 4) {
  const [related, setRelated] = useState<Product[]>([])

  useEffect(() => {
    if (!currentProduct) return

    const supabase = createClient()

    async function fetchRelated() {
      const [productsRes, variantsRes] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(slug)")
          .eq("is_active", true)
          .neq("id", currentProduct!.id)
          .limit(count),
        supabase
          .from("product_variants")
          .select("id, product_id, size, color, stock_quantity")
          .eq("is_active", true),
      ])

      if (productsRes.error || variantsRes.error) return

      const dbProducts = (productsRes.data ?? []) as unknown as DBProduct[]
      const dbVariants = (variantsRes.data ?? []) as DBVariant[]

      setRelated(dbProducts.map((p) => mapProduct(p, dbVariants)))
    }

    fetchRelated()
  }, [currentProduct, count])

  return related
}
