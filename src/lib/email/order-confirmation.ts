import { Resend } from "resend"
import { escapeHtml } from "@/utils"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "Zero Limit <orders@zerolimit.store>"

interface OrderEmailData {
  to: string
  orderNumber: string
  items: { name: string; size: string; color: string; quantity: number; price: number }[]
  subtotal: number
  shipping: number
  total: number
  shippingAddress: {
    first_name: string
    last_name: string
    address: string
    city: string
    state: string
  }
}

function buildOrderEmailHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;">
          ${escapeHtml(item.name)}
          <br/><span style="font-size:12px;color:#888;">Size: ${escapeHtml(item.size)} &middot; Color: ${escapeHtml(item.color)}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;text-align:right;">
          ₦${item.price.toLocaleString()}
        </td>
      </tr>`
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#111;padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;font-weight:400;letter-spacing:4px;margin:0;">ZERO LIMIT</h1>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="font-size:24px;font-weight:400;margin:0 0 8px;">Order Confirmed</h2>
      <p style="font-size:14px;color:#666;margin:0 0 24px;">
        Thank you for your order. We&apos;ll notify you when it ships.
      </p>
      <div style="background:#f9f9f9;padding:16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#666;">Order Number</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;font-family:monospace;">${data.orderNumber}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #111;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #111;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #111;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <div style="border-top:2px solid #111;padding-top:16px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#666;margin-bottom:8px;">
          <span>Subtotal</span><span>₦${data.subtotal.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#666;margin-bottom:8px;">
          <span>Shipping</span><span>${data.shipping === 0 ? "Free" : `₦${data.shipping.toLocaleString()}`}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:600;margin-top:12px;padding-top:12px;border-top:1px solid #eee;">
          <span>Total</span><span>₦${data.total.toLocaleString()}</span>
        </div>
      </div>
      <div style="background:#f9f9f9;padding:16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:1px;">Delivery Address</p>
        <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
          ${escapeHtml(data.shippingAddress.first_name)} ${escapeHtml(data.shippingAddress.last_name)}<br/>
          ${escapeHtml(data.shippingAddress.address)}<br/>
          ${escapeHtml(data.shippingAddress.city)}, ${escapeHtml(data.shippingAddress.state)}
        </p>
      </div>
    </div>
    <div style="background:#111;padding:24px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#666;">© ${new Date().getFullYear()} Zero Limit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set — skipping order confirmation email")
    return { success: false, skipped: true }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: data.to,
      subject: `Order Confirmed — ${data.orderNumber}`,
      html: buildOrderEmailHtml(data),
    })
    return { success: true }
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error)
    return { success: false, error }
  }
}
