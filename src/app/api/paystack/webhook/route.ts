import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature || !PAYSTACK_SECRET_KEY) return false
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(body).digest("hex")
  return hash === signature
}

export async function POST(req: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get("x-paystack-signature")

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true })
  }

  const tx = event.data
  const reference = tx.reference
  const amountPaid = tx.amount / 100
  const customerEmail = tx.customer?.email

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_reference", reference)
    .single()

  if (existing) {
    return NextResponse.json({ received: true, message: "Order already exists" })
  }

  const metadata = tx.metadata || {}
  const userId = metadata.user_id
  const shipping = metadata.shipping_address
  const items = metadata.items
  const claimedTotal = metadata.total

  if (!userId || !items || !shipping || !claimedTotal) {
    console.error("[Webhook] Missing metadata for reference:", reference)
    return NextResponse.json({ received: true })
  }

  if (Math.abs(amountPaid - claimedTotal) > 1) {
    console.error(`[Webhook] Amount mismatch: paid=${amountPaid}, claimed=${claimedTotal}, ref=${reference}`)
    return NextResponse.json({ received: true })
  }

  const orderNumber = `ZL-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      order_number: orderNumber,
      status: "confirmed",
      payment_status: "paid",
      subtotal: shipping.subtotal ?? claimedTotal,
      shipping_fee: shipping.shipping_cost ?? 0,
      discount: 0,
      total: claimedTotal,
      shipping_address: {
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        phone: shipping.phone,
        email: customerEmail,
      },
      payment_method: tx.channel || "paystack",
      payment_reference: reference,
    })
    .select()
    .single()

  if (orderError) {
    console.error("[Webhook] Order insert error:", orderError)
    return NextResponse.json({ received: false, error: "Order creation failed" }, { status: 500 })
  }

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    name: item.name,
    quantity: item.quantity,
    price: item.unit_price,
    total: item.unit_price * item.quantity,
    size: item.size,
    color: item.color,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("[Webhook] Order items insert error:", itemsError)
    await supabase.from("orders").delete().eq("id", order.id)
    return NextResponse.json({ received: false, error: "Order items creation failed" }, { status: 500 })
  }

  for (const item of items) {
    if (item.variant_id) {
      const { error: varStockErr } = await supabase.rpc("decrement_stock_atomic", {
        p_table: "product_variants",
        p_id: item.variant_id,
        p_quantity: item.quantity,
      })
      if (varStockErr) console.error("[Webhook] Variant stock decrement failed:", varStockErr)
    }
    const { error: prodStockErr } = await supabase.rpc("decrement_stock_atomic", {
      p_table: "products",
      p_id: item.product_id,
      p_quantity: item.quantity,
    })
    if (prodStockErr) console.error("[Webhook] Product stock decrement failed:", prodStockErr)
  }

  console.log(`[Webhook] Order ${orderNumber} created from webhook for ref ${reference}`)

  return NextResponse.json({ received: true })
}
