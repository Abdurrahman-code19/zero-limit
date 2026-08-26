import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const returnSchema = z.object({
  order_id: z.string().uuid(),
  reason: z.string().min(10).max(2000),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("return_requests")
    .select("*, orders!inner(order_number)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ returns: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = returnSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { order_id, reason } = parsed.data

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, status, user_id")
    .eq("id", order_id)
    .single()

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  if (order.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (order.status !== "delivered") {
    return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from("return_requests")
    .select("id")
    .eq("order_id", order_id)
    .eq("user_id", user.id)
    .in("status", ["pending", "approved"])
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "A return request for this order is already pending" }, { status: 409 })
  }

  const { error } = await supabase.from("return_requests").insert({
    user_id: user.id,
    order_id,
    order_number: order.order_number,
    reason,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
