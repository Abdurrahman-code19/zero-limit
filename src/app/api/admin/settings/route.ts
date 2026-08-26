import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

async function requireAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", status: 401 } as const

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { error: "Forbidden", status: 403 } as const
  }
  return { supabase, user } as const
}

// ============================================
// STORE SETTINGS
// ============================================
const SettingsSchema = z.object({
  store_name: z.string().min(1).max(200).optional(),
  store_email: z.string().email().max(200).optional(),
  store_address: z.string().max(500).optional(),
  store_phone: z.string().max(50).optional(),
  shipping_fee: z.number().min(0).optional(),
  free_shipping_threshold: z.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(500).optional(),
  announcement_text: z.string().max(500).optional(),
  announcement_active: z.boolean().optional(),
}).strict()

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("store_settings").select("*").limit(1).single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ settings: data || {} })
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const body = await request.json()
  const parsed = SettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: existing } = await admin.supabase.from("store_settings").select("id").limit(1).single()

  if (existing) {
    const { data, error } = await admin.supabase
      .from("store_settings").update(parsed.data).eq("id", existing.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ settings: data })
  } else {
    const { data, error } = await admin.supabase
      .from("store_settings").insert(parsed.data).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ settings: data }, { status: 201 })
  }
}
