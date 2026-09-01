"use client"

import { useState, useEffect } from "react"
import { Star, Trash2, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ReviewWithProduct {
  id: string
  rating: number
  comment: string | null
  created_at: string
  user_email: string
  user_name: string
  product_name: string
  product_slug: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => { loadReviews() }, [])

  async function loadReviews() {
    const supabase = createClient()
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, user_id, product_id")

    if (!reviewsData) { setLoading(false); return }

    const userIds = [...new Set(reviewsData.map((r) => r.user_id))]
    const productIds = [...new Set(reviewsData.map((r) => r.product_id))]

    const [usersRes, productsRes] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name").in("id", userIds),
      supabase.from("products").select("id, name, slug").in("id", productIds),
    ])

    const userMap = Object.fromEntries((usersRes.data ?? []).map((u) => [u.id, u]))
    const productMap = Object.fromEntries((productsRes.data ?? []).map((p) => [p.id, p]))

    const mapped = reviewsData.map((r) => ({
      ...r,
      user_email: (userMap[r.user_id] as any)?.email ?? "Unknown",
      user_name: (userMap[r.user_id] as any)?.full_name ?? "Unknown",
      product_name: (productMap[r.product_id] as any)?.name ?? "Unknown",
      product_slug: (productMap[r.product_id] as any)?.slug ?? "",
    }))

    setReviews(mapped)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" })
    setConfirmId(null)
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const filtered = reviews.filter((r) =>
    r.product_name.toLowerCase().includes(search.toLowerCase()) ||
    r.user_name.toLowerCase().includes(search.toLowerCase()) ||
    r.user_email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Reviews</h1><div className="h-64 animate-pulse bg-muted rounded" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">{reviews.length} reviews total</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Rating</th>
                <th className="text-left p-4 font-medium">Comment</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No reviews found</td></tr>
              ) : (
                filtered.map((review) => (
                  <tr key={review.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <a href={`/product/${review.product_slug}`} className="font-medium hover:underline">{review.product_name}</a>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{review.user_name}</p>
                      <p className="text-xs text-muted-foreground">{review.user_email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{review.comment ?? "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConfirmId(review.id)}>
                        <Trash2 className="h-4 w-4" />
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

      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => { if (!open) setConfirmId(null) }}
        title="Delete review"
        description="Are you sure you want to delete this review? This cannot be recovered."
        onConfirm={() => { if (confirmId) handleDelete(confirmId) }}
      />
    </div>
  )
}
