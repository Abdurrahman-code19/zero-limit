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
  notes: z.string().max(2000).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
      .eq("id", id)
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
    .eq("id", id)
    .select("*, profiles(email, full_name), order_items(name, quantity)")
    .single()

  if (error) {
    console.error("[Admin] Order status update failed:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }

  // Append to status_history (non-blocking)
  if (status || payment_status) {
    const entry: Record<string, string> = { at: new Date().toISOString() }
    if (status) entry.status = status
    if (payment_status) entry.payment_status = payment_status
    supabase.rpc("append_order_status_history", {
      p_order_id: id,
      p_entry: entry,
    }).then(() => {}, (err: Error) => console.error("[Status] Failed to append history:", err))
  }

  // Send status update email (non-blocking)
  if (status && order.profiles?.email) {
    sendOrderStatusUpdate({
      to: order.profiles.email,
      orderNumber: order.order_number,
      status,
      trackingNumber: order.tracking_number,
    }).catch((err) => console.error("[Email] Status update email failed:", err))
  }

  // Create in-app notification (non-blocking)
  if (status && order.user_id) {
    const statusMessages: Record<string, { title: string; message: string }> = {
      confirmed: { title: "Order Confirmed", message: `Your order ${order.order_number} has been confirmed and is being processed.` },
      processing: { title: "Order Processing", message: `Your order ${order.order_number} is now being prepared.` },
      shipped: { title: "Order Shipped", message: `Your order ${order.order_number} has been shipped! ${order.tracking_number ? `Tracking: ${order.tracking_number}` : ""}` },
      delivered: { title: "Order Delivered", message: `Your order ${order.order_number} has been delivered. Enjoy!` },
      cancelled: { title: "Order Cancelled", message: `Your order ${order.order_number} has been cancelled.` },
      refunded: { title: "Order Refunded", message: `Your order ${order.order_number} has been refunded.` },
    }
    const notif = statusMessages[status]
    if (notif) {
      supabase.from("notifications").insert({
        user_id: order.user_id,
        type: "order",
        title: notif.title,
        message: notif.message,
      }).then(() => {}, (err: Error) => console.error("[Notification] Failed to create:", err))
    }
  }

  return NextResponse.json({ order })
}
