import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const addressSchema = z.object({
  label: z.string().max(50).optional().default("Home"),
  full_name: z.string().min(1).max(200),
  phone: z.string().max(20).optional(),
  address_line_1: z.string().min(1).max(500),
  address_line_2: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postal_code: z.string().max(20).optional(),
  is_default: z.boolean().optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ addresses: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = addressSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const data = parsed.data

  if (data.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
  }

  const { count } = await supabase.from("addresses").select("id", { count: "exact", head: true }).eq("user_id", user.id)
  const isFirst = !count || count === 0

  const { data: address, error } = await supabase.from("addresses").insert({
    user_id: user.id,
    label: data.label,
    full_name: data.full_name,
    phone: data.phone || null,
    address_line_1: data.address_line_1,
    address_line_2: data.address_line_2 || null,
    city: data.city,
    state: data.state,
    postal_code: data.postal_code || null,
    is_default: isFirst || data.is_default,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ address }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
