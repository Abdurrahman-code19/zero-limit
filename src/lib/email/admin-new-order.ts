import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev"

interface AdminNewOrderEmailProps {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  itemCount: number
}

export async function sendAdminNewOrder({
  orderNumber,
  customerName,
  customerEmail,
  total,
  itemCount,
}: AdminNewOrderEmailProps) {
  await resend.emails.send({
    from: FROM,
    to: "zerolimitunlimited@gmail.com",
    subject: `New Order — ${orderNumber}`,
    html: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: #f9fafb; color: #111;">
        <h2 style="font-size: 20px; margin-bottom: 16px;">New Order Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px 0; color: #666;">Order</td><td style="padding: 8px 0; font-weight: 600;">${orderNumber}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0;">${customerName} (${customerEmail})</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Items</td><td style="padding: 8px 0;">${itemCount}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0; font-weight: 600;">₦${total.toLocaleString()}</td></tr>
        </table>
        <a href="https://zero-limit-tau.vercel.app/admin/orders" style="display: inline-block; padding: 10px 24px; background: #000; color: #fff; text-decoration: none; font-size: 13px; letter-spacing: 0.05em;">View in Admin</a>
      </div>
    `,
  })
}
