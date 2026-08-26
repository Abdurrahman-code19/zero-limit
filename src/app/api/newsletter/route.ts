import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const Schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }

  const supabase = await createClient()
  const email = parsed.data.email.toLowerCase().trim()

  const { error: subError } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, source: "website" }, { onConflict: "email" })

  if (subError) {
    console.error("[Newsletter] Failed to save subscriber:", subError)
  }

  await supabase.from("activity_logs").insert({
    user_id: null,
    action: "newsletter_subscribe",
    details: { email },
  })

  return NextResponse.json({ success: true })
}
