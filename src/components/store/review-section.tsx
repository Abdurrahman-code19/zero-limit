"use client"

import { useEffect, useState } from "react"
import { Star, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Review {
  id: string
  user_id: string
  rating: number
  title?: string
  comment?: string
  created_at: string
  author_name: string
}

export function ReviewSection({ productId }: { productId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    fetch(`/api/reviews?product_id=${productId}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async () => {
    if (!rating) return
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, rating, title: title || undefined, comment: comment || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to submit review")
        return
      }
      setSuccess(true)
      setRating(0)
      setTitle("")
      setComment("")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <section className="mt-20 md:mt-28">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Customer Reviews
          </p>
          <h2 className="text-2xl md:text-3xl font-light">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= Math.round(avgRating) ? "fill-foreground text-foreground" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} average</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground mb-10">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <div className="space-y-6 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i <= review.rating ? "fill-foreground text-foreground" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{review.author_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {user ? (
        <div className="border p-6 space-y-4">
          <h3 className="font-medium">Write a Review</h3>
          {success && <p className="text-sm text-green-600">Review submitted! It will appear after admin approval.</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <p className="text-sm text-muted-foreground mb-2">Your rating *</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      i <= (hoverRating || rating)
                        ? "fill-foreground text-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Title (optional)</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="max-w-md"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Your review (optional)</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you think about this product..."
              rows={4}
              className="max-w-md"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!rating || submitting}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-none"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Submit Review
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please <a href="/login" className="underline hover:text-foreground">sign in</a> to leave a review.
        </p>
      )}
    </section>
  )
}
