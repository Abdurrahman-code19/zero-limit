"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useWishlistStore } from "@/store/wishlist"

export function useWishlistDbSync() {
  const { ids, toggle, remove } = useWishlistStore()

  useEffect(() => {
    const supabase = createClient()

    const syncFromDb = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: dbItems } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id)

      if (!dbItems) return

      const dbIds = dbItems.map((item) => item.product_id)
      const merged = [...new Set([...ids, ...dbIds])]

      if (merged.length > ids.length) {
        useWishlistStore.setState({ ids: merged })
      }

      const localOnly = ids.filter((id) => !dbIds.includes(id))
      for (const productId of localOnly) {
        await supabase.from("wishlist").insert({
          user_id: user.id,
          product_id: productId,
        })
      }
    }

    syncFromDb()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const syncToggle = async (productId: string) => {
    toggle(productId)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existing) {
      await supabase.from("wishlist").delete().eq("id", existing.id)
    } else {
      await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: productId,
      })
    }
  }

  const syncRemove = async (productId: string) => {
    remove(productId)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)
  }

  return { ids, syncToggle, syncRemove }
}
