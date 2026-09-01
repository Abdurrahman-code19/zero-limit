"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Pencil, Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  _count?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const supabase = createClient()
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("name")

    if (cats) {
      const withCounts = await Promise.all(
        cats.map(async (cat) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", cat.id)
          return { ...cat, _count: count ?? 0 }
        })
      )
      setCategories(withCounts)
    }
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
      await fetch(`/api/admin/categories?id=${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug, description: description.trim() || "" }),
      })
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug, description: description.trim() || "" }),
      })
    }

    setName("")
    setDescription("")
    setEditingId(null)
    setShowForm(false)
    setSaving(false)
    loadCategories()
  }

  async function handleDelete(id: string, catName: string) {
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" })
    setConfirmTarget(null)
    loadCategories()
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setName(cat.name)
    setDescription(cat.description ?? "")
    setShowForm(true)
  }

  function cancelEdit() {
    setEditingId(null)
    setName("")
    setDescription("")
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">{categories.length} categories</p>
        </div>
        <Button onClick={() => { cancelEdit(); setShowForm(!showForm) }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Category" : "New Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">Products</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No categories yet. Create one to organize your products.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <p className="font-medium">{cat.name}</p>
                      {cat.description && <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{cat.slug}</td>
                    <td className="p-4">
                      <Badge variant="secondary">{cat._count ?? 0}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(cat)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConfirmTarget({ id: cat.id, name: cat.name })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title="Delete category"
        description={`Are you sure you want to delete "${confirmTarget?.name}"? Products in this category will lose their category assignment. This cannot be recovered.`}
        onConfirm={() => confirmTarget && handleDelete(confirmTarget.id, confirmTarget.name)}
      />
    </div>
  )
}
