import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

async function requireAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", status: 401 } as const

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { error: "Forbidden", status: 403 } as const
  }
  return { supabase, user } as const
}

// ============================================
// COUPONS
// ============================================
const CouponSchema = z.object({
  code: z.string().min(2).max(50).toUpperCase(),
  description: z.string().max(200).optional().default(""),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive(),
  min_order_amount: z.number().int().min(0).optional().default(0),
  max_uses: z.number().int().min(1).nullable().optional(),
  expires_at: z.string().nullable().optional(),
  is_active: z.boolean().optional().default(true),
}).strict()

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const body = await request.json()
  const parsed = CouponSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  if (parsed.data.discount_type === "percentage" && parsed.data.discount_value > 100) {
    return NextResponse.json({ error: "Percentage discount cannot exceed 100" }, { status: 400 })
  }

  const { data, error } = await admin.supabase
    .from("coupons").insert(parsed.data).select().single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ coupon: data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Coupon ID required" }, { status: 400 })

  const body = await request.json()
  const parsed = CouponSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await admin.supabase
    .from("coupons").update(parsed.data).eq("id", id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ coupon: data })
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Coupon ID required" }, { status: 400 })

  const { error } = await admin.supabase.from("coupons").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
