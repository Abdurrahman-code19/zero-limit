import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

async function requireAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", status: 401 } as const
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { error: "Forbidden", status: 403 } as const
  }
  return { supabase, user } as const
}

// ============================================
// INVENTORY - Update stock
// ============================================
const StockSchema = z.object({
  product_id: z.string().uuid(),
  stock_quantity: z.number().int().min(0),
}).strict()

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const body = await request.json()
  const parsed = StockSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await admin.supabase
    .from("products").update({
      stock_quantity: parsed.data.stock_quantity,
      updated_at: new Date().toISOString(),
    }).eq("id", parsed.data.product_id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}
