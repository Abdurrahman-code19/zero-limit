import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmation } from "@/lib/email/order-confirmation"
import { sendAdminNewOrder } from "@/lib/email/admin-new-order"
import { z } from "zod"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

const OrderItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(100),
  size: z.string().max(50),
  color: z.string().max(50),
  unit_price: z.number().min(0),
})

const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1).max(50),
  shipping: z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(20),
    address: z.string().min(1).max(500),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
  }),
  subtotal: z.number().min(0),
  shipping_cost: z.number().min(0),
  total: z.number().min(0),
  payment_reference: z.string().min(1).max(100),
  payment_method: z.string().max(50),
})

async function verifyPayment(reference: string): Promise<{ verified: boolean; amount: number }> {
  if (!PAYSTACK_SECRET_KEY) return { verified: false, amount: 0 }
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    })
    const data = await res.json()
    if (!data.status || data.data.status !== "success") return { verified: false, amount: 0 }
    return { verified: true, amount: data.data.amount / 100 }
  } catch {
    return { verified: false, amount: 0 }
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = OrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order data", details: parsed.error.flatten() }, { status: 400 })
    }

    const { items, shipping, subtotal, shipping_cost, total, payment_reference, payment_method } = parsed.data

    const { verified, amount: paidAmount } = await verifyPayment(payment_reference)
    if (!verified) {
      return NextResponse.json({ error: "Payment could not be verified" }, { status: 400 })
    }

    if (Math.abs(paidAmount - total) > 1) {
      return NextResponse.json({ error: "Payment amount does not match order total" }, { status: 400 })
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_reference", payment_reference)
      .single()

    if (existingOrder) {
      return NextResponse.json({ error: "This payment has already been used" }, { status: 409 })
    }

    for (const item of items) {
      if (item.variant_id) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock_quantity")
          .eq("id", item.variant_id)
          .single()

        if (!variant || variant.stock_quantity < item.quantity) {
          return NextResponse.json({ error: `"${item.name}" (size ${item.size}) is out of stock` }, { status: 400 })
        }
      }

      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single()

      if (!product || product.stock_quantity < item.quantity) {
        return NextResponse.json({ error: `"${item.name}" is out of stock` }, { status: 400 })
      }
    }

    const crypto = await import("crypto")
    const orderNumber = `ZL-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "confirmed",
        payment_status: "paid",
        subtotal,
        shipping_fee: shipping_cost,
        discount: 0,
        total,
        shipping_address: shipping,
        payment_method,
        payment_reference,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order insert error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item) => ({
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
      console.error("Order items insert error:", itemsError)
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 })
    }

    for (const item of items) {
      if (item.variant_id) {
        await supabase.rpc("decrement_stock_atomic", {
          p_table: "product_variants",
          p_id: item.variant_id,
          p_quantity: item.quantity,
        })
      }
      await supabase.rpc("decrement_stock_atomic", {
        p_table: "products",
        p_id: item.product_id,
        p_quantity: item.quantity,
      })
    }

    sendOrderConfirmation({
      to: shipping.email,
      orderNumber,
      items: items.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.unit_price,
      })),
      subtotal,
      shipping: shipping_cost,
      total,
      shippingAddress: shipping,
    }).catch((err) => console.error("[Email] Order confirmation failed:", err))

    sendAdminNewOrder({
      orderNumber,
      customerName: `${shipping.first_name} ${shipping.last_name}`,
      customerEmail: shipping.email,
      total,
      itemCount: items.length,
    }).catch((err) => console.error("[Email] Admin notification failed:", err))

    return NextResponse.json({
      status: true,
      data: { order_id: order.id, order_number: orderNumber, total },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
  }
}
