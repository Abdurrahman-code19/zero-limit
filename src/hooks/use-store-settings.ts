"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface StoreSettings {
  store_name: string
  store_email: string
  store_phone: string
  store_address: string
  shipping_fee: number
  free_shipping_threshold: number
  currency: string
  meta_title: string
  meta_description: string
  announcement_text: string
  announcement_active: boolean
}

const DEFAULTS: StoreSettings = {
  store_name: "Zero Limit",
  store_email: "zerolimitunlimited@gmail.com",
  store_phone: "",
  store_address: "Lagos, Nigeria",
  shipping_fee: 2000,
  free_shipping_threshold: 50000,
  currency: "NGN",
  meta_title: "Zero Limit — Premium Fashion",
  meta_description: "Curated fashion pieces that define contemporary elegance.",
  announcement_text: "",
  announcement_active: false,
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings({
            store_name: data.store_name ?? DEFAULTS.store_name,
            store_email: data.store_email ?? DEFAULTS.store_email,
            store_phone: data.store_phone ?? DEFAULTS.store_phone,
            store_address: data.store_address ?? DEFAULTS.store_address,
            shipping_fee: data.shipping_fee ?? DEFAULTS.shipping_fee,
            free_shipping_threshold: data.free_shipping_threshold ?? DEFAULTS.free_shipping_threshold,
            currency: data.currency ?? DEFAULTS.currency,
            meta_title: data.meta_title ?? DEFAULTS.meta_title,
            meta_description: data.meta_description ?? DEFAULTS.meta_description,
            announcement_text: data.announcement_text ?? DEFAULTS.announcement_text,
            announcement_active: data.announcement_active ?? DEFAULTS.announcement_active,
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { settings, loading }
}
