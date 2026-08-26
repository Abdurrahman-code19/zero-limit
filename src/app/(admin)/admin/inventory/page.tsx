"use client"

import { useState, useEffect } from "react"
import { Package, AlertTriangle, Search, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils"

interface InventoryItem {
  id: string
  name: string
  slug: string
  price: number
  stock_quantity: number
  is_active: boolean
  category_name: string | null
  variant_count: number
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState<Record<string, number>>({})

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    const supabase = createClient()
    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, price, stock_quantity, is_active, categories(name)")
      .order("name")

    if (products) {
      const withVariants = await Promise.all(
        products.map(async (p) => {
          const { count } = await supabase
            .from("product_variants")
            .select("*", { count: "exact", head: true })
            .eq("product_id", p.id)
          return {
            ...p,
            category_name: (p.categories as any)?.name ?? null,
            variant_count: count ?? 0,
          }
        })
      )
      setItems(withVariants)
    }
    setLoading(false)
  }

  async function updateStock(id: string, newStock: number) {
    setUpdatingId(id)
    await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: id, stock_quantity: newStock }),
    })
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, stock_quantity: newStock } : item))
    setEditStock((prev) => { const n = { ...prev }; delete n[id]; return n })
    setUpdatingId(null)
  }

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalStock = items.reduce((sum, i) => sum + i.stock_quantity, 0)
  const outOfStock = items.filter((i) => i.stock_quantity === 0).length
  const lowStock = items.filter((i) => i.stock_quantity > 0 && i.stock_quantity <= 5).length

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Manage stock levels across all products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalStock}</p>
                <p className="text-xs text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{lowStock}</p>
                <p className="text-xs text-muted-foreground">Low Stock (≤5)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{outOfStock}</p>
                <p className="text-xs text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Variants</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.slug}</p>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground capitalize">{item.category_name ?? "—"}</td>
                      <td className="p-4 text-sm">{formatCurrency(item.price)}</td>
                      <td className="p-4 text-sm">{item.variant_count}</td>
                      <td className="p-4">
                        {editStock[item.id] !== undefined ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              defaultValue={item.stock_quantity}
                              onChange={(e) => setEditStock((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))}
                              className="w-20 h-8 text-sm border rounded px-2"
                              min="0"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2"
                              onClick={() => updateStock(item.id, editStock[item.id])}
                              disabled={updatingId === item.id}
                            >
                              {updatingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "✓"}
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={`font-medium cursor-pointer hover:underline ${
                              item.stock_quantity === 0 ? "text-destructive" : item.stock_quantity <= 5 ? "text-yellow-600" : ""
                            }`}
                            onClick={() => setEditStock((prev) => ({ ...prev, [item.id]: item.stock_quantity }))}
                          >
                            {item.stock_quantity}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={item.is_active ? "success" : "secondary"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditStock((prev) => ({ ...prev, [item.id]: item.stock_quantity }))}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
