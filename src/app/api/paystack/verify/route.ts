import { NextRequest, NextResponse } from "next/server"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(req: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Paystack not configured" },
      { status: 500 }
    )
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      )
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await res.json()

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || "Verification failed" },
        { status: 400 }
      )
    }

    const tx = data.data

    if (tx.status !== "success") {
      return NextResponse.json(
        { error: `Transaction status: ${tx.status}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      status: true,
      data: {
        reference: tx.reference,
        amount: tx.amount / 100,
        currency: tx.currency,
        channel: tx.channel,
        paid_at: tx.paid_at,
        customer_email: tx.customer?.email,
        metadata: tx.metadata,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
