import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

async function requireAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", status: 401 } as const
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { error: "Forbidden", status: 403 } as const
  }
  return { supabase, user } as const
}

// ============================================
// CMS CONTENT
// ============================================
const CmsSchema = z.object({
  page_key: z.string().min(1).max(100),
  page_title: z.string().min(1).max(200),
  sections: z.array(z.any()).optional(),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(500).optional(),
}).strict()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pageKey = searchParams.get("page_key")

  const supabase = await createClient()

  if (pageKey) {
    const { data, error } = await supabase
      .from("cms_content").select("*").eq("page_key", pageKey).single()
    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ content: data || null })
  }

  const { data, error } = await supabase.from("cms_content").select("*").order("page_key")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ pages: data })
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const body = await request.json()
  const parsed = CmsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: existing } = await admin.supabase
    .from("cms_content").select("id").eq("page_key", parsed.data.page_key).single()

  if (existing) {
    const { data, error } = await admin.supabase
      .from("cms_content").update(parsed.data).eq("id", existing.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ content: data })
  } else {
    const { data, error } = await admin.supabase
      .from("cms_content").insert(parsed.data).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ content: data }, { status: 201 })
  }
}
