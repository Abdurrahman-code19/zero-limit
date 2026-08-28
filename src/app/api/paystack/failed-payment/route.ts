import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { FROM_ORDERS, ADMIN_EMAIL } from "@/lib/email/senders"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = FROM_ORDERS

const Schema = z.object({
  email: z.string().email(),
  reference: z.string().optional(),
  amount: z.number().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const { email, reference, amount } = parsed.data

  // Notify customer
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Payment Failed — Zero Limit",
    html: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: #f9fafb; color: #111;">
        <h2 style="font-size: 20px; margin-bottom: 16px;">Payment Failed</h2>
        <p>We couldn't process your payment${reference ? ` (ref: <strong>${reference}</strong>)` : ""}.</p>
        ${amount ? `<p>Amount: <strong>₦${amount.toLocaleString()}</strong></p>` : ""}
        <p>No charges were made. Please try again or contact support if the issue persists.</p>
        <a href="https://www.zerolimit.store/cart" style="display: inline-block; padding: 10px 24px; background: #000; color: #fff; text-decoration: none; font-size: 13px; margin-top: 16px;">Return to Cart</a>
      </div>
    `,
  }).catch((err) => console.error("[Email] Payment failure email failed:", err))

  // Notify admin
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Payment Failed — ${email}`,
    html: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: #f9fafb; color: #111;">
        <h2 style="font-size: 18px; margin-bottom: 12px;">Payment Failed</h2>
        <p><strong>Customer:</strong> ${email}</p>
        ${reference ? `<p><strong>Reference:</strong> ${reference}</p>` : ""}
        ${amount ? `<p><strong>Amount:</strong> ₦${amount.toLocaleString()}</p>` : ""}
      </div>
    `,
  }).catch((err) => console.error("[Email] Admin payment failure notification failed:", err))

  return NextResponse.json({ success: true })
}
