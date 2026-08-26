import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = validateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { code, subtotal } = parsed.data

  const supabase = await createClient()
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single()

  if (error || !coupon) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired" }, { status: 410 })
  }

  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 410 })
  }

  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return NextResponse.json(
      { error: `Minimum order amount is ₦${Number(coupon.min_order_amount).toLocaleString()}` },
      { status: 400 }
    )
  }

  let discount = 0
  if (coupon.discount_type === "percentage") {
    discount = Math.round(subtotal * (Number(coupon.discount_value) / 100))
  } else if (coupon.discount_type === "fixed") {
    discount = Math.min(Number(coupon.discount_value), subtotal)
  }

  return NextResponse.json({
    coupon_id: coupon.id,
    code: coupon.code,
    type: coupon.discount_type,
    value: Number(coupon.discount_value),
    discount,
    description: coupon.description,
  })
}
