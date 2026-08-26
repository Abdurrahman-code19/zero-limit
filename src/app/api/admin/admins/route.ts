import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

async function requireSuperAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", status: 401 } as const
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || profile.role !== "super_admin") {
    return { error: "Forbidden: super_admin required", status: 403 } as const
  }
  return { supabase, user } as const
}

// ============================================
// ADMINS - Role changes (super_admin only)
// ============================================
const RoleSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "super_admin", "customer"]),
}).strict()

export async function PATCH(request: NextRequest) {
  const admin = await requireSuperAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const body = await request.json()
  const parsed = RoleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: profile } = await admin.supabase
    .from("profiles").select("role").eq("id", parsed.data.user_id).single()

  if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (parsed.data.role === "customer" && profile.role === "super_admin") {
    return NextResponse.json({ error: "Cannot remove super_admin role" }, { status: 403 })
  }

  const { error } = await admin.supabase
    .from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
