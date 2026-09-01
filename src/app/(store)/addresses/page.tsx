"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Plus, Trash2, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Address } from "@/types"

const NIGERIAN_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [label, setLabel] = useState("Home")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [addr1, setAddr1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [isDefault, setIsDefault] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses")
    const data = await res.json()
    setAddresses(data.addresses ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAddresses() }, [])

  const resetForm = () => {
    setLabel("Home"); setFullName(""); setPhone(""); setAddr1(""); setCity(""); setState(""); setIsDefault(false)
  }

  const handleCreate = async () => {
    if (!fullName.trim() || !addr1.trim() || !city.trim() || !state.trim()) return
    setSaving(true)
    setError(null)
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, full_name: fullName, phone, address_line_1: addr1, city, state, is_default: isDefault }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Failed to save")
      setSaving(false)
      return
    }
    resetForm()
    setShowForm(false)
    fetchAddresses()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/addresses?id=${id}`, { method: "DELETE" })
    setConfirmId(null)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/profile" className="hover:text-foreground">Profile</Link>
        <span>/</span>
        <span className="text-foreground">Addresses</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light">Address Book</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-foreground text-background hover:bg-foreground/90 rounded-none text-xs tracking-widest uppercase">
            <Plus className="h-4 w-4 mr-2" /> Add Address
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md">
                  <option>Home</option><option>Work</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name *</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded" />
                  Set as default
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Address *</label>
              <Input value={addr1} onChange={(e) => setAddr1(e.target.value)} placeholder="House number, street, landmark" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">State *</label>
                <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md">
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm() }} className="rounded-none text-xs">Cancel</Button>
              <Button onClick={handleCreate} disabled={saving} className="bg-foreground text-background hover:bg-foreground/90 rounded-none text-xs">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Address
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-16 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4" />
          <p className="mb-4">No saved addresses yet</p>
          <Button onClick={() => setShowForm(true)} className="bg-foreground text-background hover:bg-foreground/90 rounded-none text-xs tracking-widest uppercase">
            <Plus className="h-4 w-4 mr-2" /> Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.is_default ? "border-foreground" : ""}>
              <CardContent className="p-5 space-y-2 relative">
                {addr.is_default && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] tracking-wider uppercase text-foreground">
                    <Star className="h-3 w-3 fill-foreground" /> Default
                  </span>
                )}
                <p className="text-xs text-muted-foreground tracking-wider uppercase">{addr.label}</p>
                <p className="font-medium text-sm">{`${(addr as unknown as Record<string, string>).full_name || addr.first_name} ${(addr as unknown as Record<string, string>).last_name || ""}`}</p>
                <p className="text-sm text-muted-foreground">{addr.address}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state}</p>
                {addr.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
                <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 p-0 h-auto mt-2" onClick={() => addr.id && setConfirmId(addr.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => { if (!open) setConfirmId(null) }}
        title="Delete address"
        description="Are you sure you want to delete this address? This cannot be recovered."
        onConfirm={() => { if (confirmId) handleDelete(confirmId) }}
      />
    </div>
  )
}
