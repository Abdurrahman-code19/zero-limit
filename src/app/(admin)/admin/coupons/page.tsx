"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Trash2, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { createClient } from "@/lib/supabase/client"

interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_amount: number | null
  max_uses: number | null
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [minOrder, setMinOrder] = useState("")
  const [maxUses, setMaxUses] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const fetchCoupons = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false })
    setCoupons((data as Coupon[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCoupons() }, [])

  const handleCreate = async () => {
    if (!code.trim() || !discountValue) return
    setCreating(true)
    setError(null)

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        description: description || "",
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        min_order_amount: minOrder ? parseFloat(minOrder) : 0,
        max_uses: maxUses ? parseInt(maxUses) : null,
        expires_at: expiresAt || null,
        is_active: true,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to create coupon")
    } else {
      setCode("")
      setDescription("")
      setDiscountValue("")
      setMinOrder("")
      setMaxUses("")
      setExpiresAt("")
      fetchCoupons()
    }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" })
    setConfirmId(null)
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/coupons?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    })
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !isActive } : c)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Coupons</h1>
        <p className="text-muted-foreground">Create and manage discount coupons</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-sm">Create Coupon</h2>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Code *</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SUMMER20" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="20% off summer sale" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as typeof discountType)} className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed (₦)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Value *</label>
              <Input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "20" : "500"} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min Order (₦)</label>
              <Input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="10000" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max Uses</label>
              <Input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Unlimited" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Expires</label>
              <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating || !code.trim() || !discountValue} className="bg-foreground text-background hover:bg-foreground/90 rounded-none">
            {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Create Coupon
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <TicketPercent className="h-12 w-12 mx-auto mb-4" />
          <p>No coupons yet</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Uses</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t">
                  <td className="px-4 py-3 font-mono font-medium">{coupon.code}</td>
                  <td className="px-4 py-3 capitalize">{coupon.discount_type}</td>
                  <td className="px-4 py-3">
                    {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₦${coupon.discount_value.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">{coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(coupon.id, coupon.is_active)} className={`px-2 py-0.5 text-xs rounded-full ${coupon.is_active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {coupon.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setConfirmId(coupon.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => { if (!open) setConfirmId(null) }}
        title="Delete coupon"
        description="Are you sure you want to delete this coupon? This cannot be recovered."
        onConfirm={() => confirmId && handleDelete(confirmId)}
      />
    </div>
  )
}
