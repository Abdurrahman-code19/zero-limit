import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "Zero Limit <orders@zerolimit.store>"

interface StatusUpdateEmailData {
  to: string
  orderNumber: string
  status: string
  trackingNumber?: string
  previousStatus?: string
}

const statusMessages: Record<string, { subject: string; heading: string; body: string }> = {
  confirmed: {
    subject: "Order Confirmed",
    heading: "Your order has been confirmed",
    body: "We&apos;re preparing your items for processing.",
  },
  processing: {
    subject: "Order Processing",
    heading: "Your order is being processed",
    body: "Our team is working on getting your order ready.",
  },
  shipped: {
    subject: "Order Shipped",
    heading: "Your order has been shipped",
    body: "Your order is on its way to you!",
  },
  delivered: {
    subject: "Order Delivered",
    heading: "Your order has been delivered",
    body: "Your order has been delivered successfully.",
  },
  cancelled: {
    subject: "Order Cancelled",
    heading: "Your order has been cancelled",
    body: "If you have any questions, please contact our support team.",
  },
  refunded: {
    subject: "Order Refunded",
    heading: "Your order has been refunded",
    body: "A refund has been processed for your order.",
  },
}

function buildStatusEmailHtml(data: StatusUpdateEmailData): string {
  const config = statusMessages[data.status] ?? {
    subject: "Order Status Updated",
    heading: "Your order status has been updated",
    body: `Your order status is now: ${data.status}.`,
  }

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
      <h2 style="font-size:24px;font-weight:400;margin:0 0 8px;">${config.heading}</h2>
      <p style="font-size:14px;color:#666;margin:0 0 24px;">${config.body}</p>
      <div style="background:#f9f9f9;padding:16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#666;">Order Number</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;font-family:monospace;">${data.orderNumber}</p>
      </div>
      <div style="background:#f9f9f9;padding:16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#666;">Status</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;text-transform:capitalize;">${data.status}</p>
      </div>
      ${data.trackingNumber ? `
      <div style="background:#f9f9f9;padding:16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#666;">Tracking Number</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;font-family:monospace;">${data.trackingNumber}</p>
      </div>
      ` : ""}
    </div>
    <div style="background:#111;padding:24px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#666;">© ${new Date().getFullYear()} Zero Limit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendOrderStatusUpdate(data: StatusUpdateEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set — skipping status update email")
    return { success: false, skipped: true }
  }

  const config = statusMessages[data.status]
  if (!config) {
    console.log(`[Email] No email template for status: ${data.status}`)
    return { success: false, skipped: true }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: data.to,
      subject: `${config.subject} — ${data.orderNumber}`,
      html: buildStatusEmailHtml(data),
    })
    return { success: true }
  } catch (error) {
    console.error("[Email] Failed to send status update email:", error)
    return { success: false, error }
  }
}
