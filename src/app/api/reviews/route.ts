import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const product_id = searchParams.get("product_id")

  if (!product_id) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, rating, title, comment, created_at, profiles(name)")
    .eq("product_id", product_id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const reviews = (data ?? []).map((r: Record<string, unknown>) => ({
    ...r,
    author_name: (r.profiles as Record<string, unknown> | null)?.name ?? "Anonymous",
    profiles: undefined,
  }))

  return NextResponse.json({ reviews })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { product_id, rating, title, comment } = parsed.data

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 })
  }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    product_id,
    rating,
    title: title || null,
    comment: comment || null,
    is_approved: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
