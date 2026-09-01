"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Pencil,
  Package,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatCurrency } from "@/utils"
import { useAdminProducts } from "@/hooks/use-admin-products"

export default function AdminProductsPage() {
  const { products, loading, deleteProduct, toggleProductStatus } = useAdminProducts()
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string } | null>(null)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id: string, name: string) {
    setDeletingId(id)
    await deleteProduct(id)
    setDeletingId(null)
    setConfirmTarget(null)
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    await toggleProductStatus(id, !currentStatus)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
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
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {search ? "No products match your search" : "No products yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground capitalize">{product.category_id}</td>
                      <td className="p-4 font-medium">{formatCurrency(product.price)}</td>
                      <td className="p-4">
                        <span className={product.stock <= 5 ? "text-destructive font-medium" : ""}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            product.is_published
                              ? "success"
                              : "secondary"
                          }
                        >
                          {product.is_published ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/product/${product.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleStatus(product.id, product.is_published)}
                          >
                            {product.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setConfirmTarget({ id: product.id, name: product.name })}
                            disabled={deletingId === product.id}
                          >
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
        title="Delete product"
        description={`Are you sure you want to delete "${confirmTarget?.name}"? This cannot be recovered.`}
        loading={deletingId !== null}
        onConfirm={() => confirmTarget && handleDelete(confirmTarget.id, confirmTarget.name)}
      />
    </div>
  )
}
