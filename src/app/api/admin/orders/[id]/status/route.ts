import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderStatusUpdate } from "@/lib/email/order-status-update"

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]

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

  const body = await request.json()
  const { status, tracking_number } = body

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (status) {
    updateData.status = status
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
    return NextResponse.json({ error: error.message }, { status: 500 })
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
