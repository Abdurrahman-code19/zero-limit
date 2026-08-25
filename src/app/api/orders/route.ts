import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmation } from "@/lib/email/order-confirmation"

interface OrderItemInput {
  product_id: string
  variant_id?: string
  name: string
  quantity: number
  size: string
  color: string
  unit_price: number
}

interface OrderInput {
  items: OrderItemInput[]
  shipping: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
  }
  subtotal: number
  shipping_cost: number
  total: number
  payment_reference: string
  payment_method: string
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to place an order" },
      { status: 401 }
    )
  }

  try {
    const body: OrderInput = await req.json()
    const { items, shipping, subtotal, shipping_cost, total, payment_reference, payment_method } = body

    if (!items?.length || !payment_reference) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ZL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Insert order
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
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    // Insert order items
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
      // Order created but items failed — log but don't block
    }

    // Decrement stock for each item
    for (const item of items) {
      // Decrement variant stock if variant_id exists
      if (item.variant_id) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock_quantity")
          .eq("id", item.variant_id)
          .single()

        if (variant && variant.stock_quantity >= item.quantity) {
          await supabase
            .from("product_variants")
            .update({ stock_quantity: variant.stock_quantity - item.quantity })
            .eq("id", item.variant_id)
        }
      }

      // Decrement product-level stock
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single()

      if (product && product.stock_quantity >= item.quantity) {
        await supabase
          .from("products")
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq("id", item.product_id)
      }
    }

    // Send confirmation email (non-blocking)
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
    }).catch(() => {})

    return NextResponse.json({
      status: true,
      data: {
        order_id: order.id,
        order_number: orderNumber,
        total,
      },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    )
  }
}
