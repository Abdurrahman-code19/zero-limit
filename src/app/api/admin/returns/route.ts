import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["approved", "rejected", "completed"]),
  admin_notes: z.string().max(2000).optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("return_requests")
    .select("*, profiles!inner(name, email)")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const returns = (data ?? []).map((r: Record<string, unknown>) => ({
    ...r,
    customer_name: (r.profiles as Record<string, unknown> | null)?.name,
    customer_email: (r.profiles as Record<string, unknown> | null)?.email,
    profiles: undefined,
  }))

  return NextResponse.json({ returns })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { id, status, admin_notes } = parsed.data

  const { data: ret } = await supabase.from("return_requests").select("id, order_id").eq("id", id).single()
  if (!ret) return NextResponse.json({ error: "Return request not found" }, { status: 404 })

  const updateData: Record<string, unknown> = { status, admin_notes: admin_notes || null }

  if (status === "approved" || status === "completed") {
    const { data: order } = await supabase
      .from("orders")
      .select("payment_reference, total")
      .eq("id", ret.order_id)
      .single()

    if (order?.payment_reference && process.env.PAYSTACK_SECRET_KEY) {
      try {
        const refundRes = await fetch("https://api.paystack.co/refund", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction: order.payment_reference,
            amount: Math.round(order.total * 100),
            note: admin_notes || "Return refund",
          }),
        })
        if (!refundRes.ok) {
          const refundErr = await refundRes.text()
          console.error("[Returns] Paystack refund failed:", refundErr)
        }
      } catch (err) {
        console.error("[Returns] Paystack refund call failed:", err)
      }
    }

    const { error: orderUpdateErr } = await supabase
      .from("orders")
      .update({ status: "refunded", payment_status: "refunded" })
      .eq("id", ret.order_id)
    if (orderUpdateErr) console.error("[Returns] Order refund update failed:", orderUpdateErr)
  }

  const { error } = await supabase.from("return_requests").update(updateData).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
