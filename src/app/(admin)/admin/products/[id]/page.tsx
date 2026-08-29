"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X, Loader2, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { uploadProductImage } from "@/lib/upload-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  slug: string
}

interface DBProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  images: string[]
  category_id: string
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  tags: string[]
}

interface DBVariant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  price: number
  stock_quantity: number
  is_active: boolean
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [variants, setVariants] = useState<DBVariant[]>([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [compareAtPrice, setCompareAtPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState("")
  const [sizes, setSizes] = useState<string[]>([])
  const [sizeInput, setSizeInput] = useState("")
  const [colors, setColors] = useState<string[]>([])
  const [colorInput, setColorInput] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const [productRes, variantsRes, catsRes] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("product_variants").select("*").eq("product_id", id),
        supabase.from("categories").select("id, name, slug").order("name"),
      ])

      if (productRes.error || !productRes.data) {
        router.replace("/admin/products")
        return
      }

      const p = productRes.data as DBProduct
      setName(p.name)
      setDescription(p.description ?? "")
      setPrice(String(p.price))
      setCompareAtPrice(p.compare_at_price ? String(p.compare_at_price) : "")
      setCategoryId(p.category_id)
      setImages(p.images ?? [])
      setStockQuantity(String(p.stock_quantity))
      setIsActive(p.is_active)
      setIsFeatured(p.is_featured)
      setIsNew(p.is_new)
      setTags(p.tags ?? [])

      const vData = (variantsRes.data ?? []) as DBVariant[]
      setVariants(vData)
      setSizes([...new Set(vData.map((v) => v.size).filter(Boolean))] as string[])
      setColors([...new Set(vData.map((v) => v.color).filter(Boolean))] as string[])

      if (catsRes.data) setCategories(catsRes.data)
      setLoading(false)
    }

    load()
  }, [id, router])

  function addItem(
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void,
    key: string
  ) {
    const val = input.trim()
    if (!val) return
    if (list.includes(val)) {
      setErrors((prev) => ({ ...prev, [key]: "Already added" }))
      setTimeout(() => setErrors((prev) => ({ ...prev, [key]: "" })), 2000)
      return
    }
    setList([...list, val])
    setInput("")
  }

  function removeItem(idx: number, list: string[], setList: (v: string[]) => void) {
    setList(list.filter((_, i) => i !== idx))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploadingImage(true)
    setErrors((prev) => ({ ...prev, image: "" }))
    try {
      const url = await uploadProductImage(file)
      setImages((prev) => (prev.includes(url) ? prev : [...prev, url]))
    } catch (err) {
      setErrors((prev) => ({ ...prev, image: err instanceof Error ? err.message : "Upload failed" }))
      setTimeout(() => setErrors((prev) => ({ ...prev, image: "" })), 3000)
    } finally {
      setUploadingImage(false)
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = "Valid price is required"
    if (!categoryId) newErrors.category = "Category is required"
    if (!stockQuantity || isNaN(Number(stockQuantity))) newErrors.stock = "Stock is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    const variants = []
    if (sizes.length > 0 && colors.length > 0) {
      for (const size of sizes) {
        for (const color of colors) {
          variants.push({
            size,
            color,
            price: Number(price),
            stock_quantity: Math.floor(Number(stockQuantity) / (sizes.length * colors.length)),
            is_active: true,
          })
        }
      }
    }

    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        images,
        category_id: categoryId || null,
        is_active: isActive,
        stock_quantity: Number(stockQuantity),
        variants,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErrors({ submit: data.error || "Failed to update product" })
      setSaving(false)
      return
    }

    router.push("/admin/products")
  }

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
    router.push("/admin/products")
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="h-8 w-32 animate-pulse bg-muted rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse bg-muted rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">{name}</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{errors.submit}</div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zero Limit Polo Shirt"
                className="mt-1"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price (₦) *</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="mt-1"
                />
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Compare at Price (₦)</label>
                <Input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("product-image-upload")?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingImage ? "Uploading..." : "Upload from computer"}
              </Button>
              <span className="text-xs text-muted-foreground">or paste a URL below</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL and press Add"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem(imageInput, setImageInput, images, setImages, "image")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(imageInput, setImageInput, images, setImages, "image")}
              >
                Add
              </Button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-md border" />
                    <button
                      type="button"
                      onClick={() => removeItem(i, images, setImages)}
                      className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Upload from your computer or paste image URLs one at a time. First image is the thumbnail.</p>
            {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Sizes</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. S, M, L, XL"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem(sizeInput, setSizeInput, sizes, setSizes, "size")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(sizeInput, setSizeInput, sizes, setSizes, "size")}
                >
                  Add
                </Button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {sizes.map((s, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {s}
                      <button type="button" onClick={() => removeItem(i, sizes, setSizes)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Colors</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="e.g. Black, White, Navy"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem(colorInput, setColorInput, colors, setColors, "color")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(colorInput, setColorInput, colors, setColors, "color")}
                >
                  Add
                </Button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {colors.map((c, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {c}
                      <button type="button" onClick={() => removeItem(i, colors, setColors)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {variants.length > 0 && (
              <div className="mt-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Current variants ({variants.length})
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Saving will rebuild all variants from the sizes and colors above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Stock Quantity *</label>
              <Input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0"
                min="0"
                className="mt-1 max-w-xs"
              />
              {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem(tagInput, setTagInput, tags, setTags, "tag")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(tagInput, setTagInput, tags, setTags, "tag")}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((t, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {t}
                      <button type="button" onClick={() => removeItem(i, tags, setTags)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-input"
                />
                Active (visible on store)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-input"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded border-input"
                />
                New Arrival
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
