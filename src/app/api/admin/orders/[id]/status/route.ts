import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderStatusUpdate } from "@/lib/email/order-status-update"
import { z } from "zod"

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]
const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"]

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
}

const PAYMENT_TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "failed", "refunded"],
  paid: ["refunded"],
  failed: ["pending", "refunded"],
  refunded: [],
}

const StatusUpdateSchema = z.object({
  status: z.enum(VALID_STATUSES as [string, ...string[]]).optional(),
  payment_status: z.enum(VALID_PAYMENT_STATUSES as [string, ...string[]]).optional(),
  tracking_number: z.string().max(100).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = StatusUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { status, payment_status, tracking_number } = parsed.data

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (status || payment_status) {
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("status, payment_status")
      .eq("id", params.id)
      .single()

    if (currentOrder) {
      if (status) {
        const allowed = ALLOWED_TRANSITIONS[currentOrder.status] ?? []
        if (!allowed.includes(status)) {
          return NextResponse.json(
            { error: `Cannot transition from "${currentOrder.status}" to "${status}"` },
            { status: 400 }
          )
        }
        updateData.status = status
      }
      if (payment_status) {
        const allowed = PAYMENT_TRANSITIONS[currentOrder.payment_status] ?? []
        if (!allowed.includes(payment_status)) {
          return NextResponse.json(
            { error: `Cannot transition payment from "${currentOrder.payment_status}" to "${payment_status}"` },
            { status: 400 }
          )
        }
        updateData.payment_status = payment_status
      }
    }
  }

  if (tracking_number !== undefined) {
    updateData.tracking_number = tracking_number || null
  }

  if (status === "shipped") {
    updateData.shipped_at = new Date().toISOString()
  }

  if (status === "delivered") {
    updateData.delivered_at = new Date().toISOString()
  }

  const { data: order, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", params.id)
    .select("*, profiles(email, full_name), order_items(name, quantity)")
    .single()

  if (error) {
    console.error("[Admin] Order status update failed:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }

  // Send status update email (non-blocking)
  if (status && order.profiles?.email) {
    sendOrderStatusUpdate({
      to: order.profiles.email,
      orderNumber: order.order_number,
      status,
      tracking_number: order.tracking_number,
    }).catch((err) => console.error("[Email] Status update email failed:", err))
  }

  return NextResponse.json({ order })
}
