import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference")
  if (!reference) {
    return NextResponse.json({ error: "Reference is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await res.json()
  if (!data.status) {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 })
  }

  const paymentStatus = data.data.status === "success" ? "paid" : "failed"

  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("reference", reference)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: paymentStatus })
}
