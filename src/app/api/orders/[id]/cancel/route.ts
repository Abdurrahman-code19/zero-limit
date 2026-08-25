import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id, status, payment_status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchErr || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    status: "cancelled",
    updated_at: new Date().toISOString(),
  }

  if (order.payment_status === "paid") {
    updates.payment_status = "refunded"
  }

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
