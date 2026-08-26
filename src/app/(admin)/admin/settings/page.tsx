"use client"

import { useState, useEffect } from "react"
import { Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StoreSettings {
  store_name: string
  store_email: string
  store_phone: string
  store_address: string
  shipping_fee: number
  free_shipping_threshold: number
  currency: string
}

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "Zero Limit",
  store_email: "support@zerolimit.store",
  store_phone: "",
  store_address: "Lagos, Nigeria",
  shipping_fee: 2000,
  free_shipping_threshold: 50000,
  currency: "NGN",
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const supabase = createClient()
    const { data } = await supabase.from("store_settings").select("*").limit(1).single()
    if (data) {
      setSettings({
        store_name: data.store_name ?? DEFAULT_SETTINGS.store_name,
        store_email: data.store_email ?? DEFAULT_SETTINGS.store_email,
        store_phone: data.store_phone ?? DEFAULT_SETTINGS.store_phone,
        store_address: data.store_address ?? DEFAULT_SETTINGS.store_address,
        shipping_fee: data.shipping_fee ?? DEFAULT_SETTINGS.shipping_fee,
        free_shipping_threshold: data.free_shipping_threshold ?? DEFAULT_SETTINGS.free_shipping_threshold,
        currency: data.currency ?? DEFAULT_SETTINGS.currency,
      })
    }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  function updateField(field: keyof StoreSettings, value: string | number) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your store settings</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <Input value={settings.store_name} onChange={(e) => updateField("store_name", e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input type="email" value={settings.store_email} onChange={(e) => updateField("store_email", e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input value={settings.store_phone} onChange={(e) => updateField("store_phone", e.target.value)} placeholder="+234..." className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input value={settings.store_address} onChange={(e) => updateField("store_address", e.target.value)} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Default Shipping Fee (₦)</label>
                <Input type="number" value={settings.shipping_fee} onChange={(e) => updateField("shipping_fee", Number(e.target.value))} min="0" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Free Shipping Threshold (₦)</label>
                <Input type="number" value={settings.free_shipping_threshold} onChange={(e) => updateField("free_shipping_threshold", Number(e.target.value))} min="0" className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free shipping</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Save Settings</>
            )}
          </Button>
          {saved && (
            <p className="text-sm text-green-600">Settings saved successfully!</p>
          )}
        </div>
      </form>
    </div>
  )
}
