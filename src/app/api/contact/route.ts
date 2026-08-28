import { NextResponse } from "next/server"
import { Resend } from "resend"
import { FROM_REPLY, FROM_CONTACT, ADMIN_EMAIL } from "@/lib/email/senders"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: FROM_REPLY,
      to: email,
      subject: `We received your message - ${subject}`,
      html: `
        <h2>Thank you for contacting Zero Limit!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you shortly.</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Best regards,<br/>Zero Limit Team</p>
      `,
    })

    await resend.emails.send({
      from: FROM_CONTACT,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
