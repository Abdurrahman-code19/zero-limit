"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => { loadCollections() }, [])

  async function loadCollections() {
    const supabase = createClient()
    const { data } = await supabase.from("collections").select("*").order("name")
    if (data) setCollections(data)
    setLoading(false)
  }

  function generateSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const slug = generateSlug(name)

    if (editingId) {
      await fetch(`/api/admin/collections?id=${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug, description: description.trim() || "" }),
      })
    } else {
      await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug, description: description.trim() || "" }),
      })
    }

    setName(""); setDescription(""); setEditingId(null); setShowForm(false); setSaving(false)
    loadCollections()
  }

  async function handleDelete(id: string, collName: string) {
    await fetch(`/api/admin/collections?id=${id}`, { method: "DELETE" })
    setConfirmTarget(null)
    loadCollections()
  }

  function startEdit(coll: Collection) {
    setEditingId(coll.id); setName(coll.name); setDescription(coll.description ?? ""); setShowForm(true)
  }

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Collections</h1><div className="h-64 animate-pulse bg-muted rounded" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Collections</h1><p className="text-muted-foreground">{collections.length} collections</p></div>
        <Button onClick={() => { setEditingId(null); setName(""); setDescription(""); setShowForm(!showForm) }}>
          <Plus className="h-4 w-4 mr-2" />Add Collection
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>{editingId ? "Edit Collection" : "New Collection"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="text-sm font-medium">Name *</label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" required /></div>
              <div><label className="text-sm font-medium">Description</label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}{editingId ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead><tr className="border-b">
              <th className="text-left p-4 font-medium">Collection</th>
              <th className="text-left p-4 font-medium">Slug</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {collections.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No collections yet</td></tr>
              ) : collections.map((coll) => (
                <tr key={coll.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4"><p className="font-medium">{coll.name}</p>{coll.description && <p className="text-xs text-muted-foreground">{coll.description}</p>}</td>
                  <td className="p-4 text-sm text-muted-foreground">{coll.slug}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(coll)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConfirmTarget({ id: coll.id, name: coll.name })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title="Delete collection"
        description={`Are you sure you want to delete "${confirmTarget?.name}"? This cannot be recovered.`}
        onConfirm={() => confirmTarget && handleDelete(confirmTarget.id, confirmTarget.name)}
      />
    </div>
  )
}
