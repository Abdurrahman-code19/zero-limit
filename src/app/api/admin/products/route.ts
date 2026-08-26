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
// PRODUCTS
// ============================================
const ProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(5000).optional().default(""),
  price: z.number().positive(),
  image_url: z.string().max(500).optional().default(""),
  category_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().optional().default(true),
  stock_quantity: z.number().int().min(0).optional().default(0),
  variants: z.array(z.object({
    size: z.string().min(1).max(10),
    color: z.string().min(1).max(20),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    is_active: z.boolean().optional().default(true),
  })).optional(),
}).strict()

const ProductUpdateSchema = ProductSchema.partial()

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const body = await request.json()
  const parsed = ProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { variants, ...productData } = parsed.data
  const { data: product, error } = await admin.supabase
    .from("products").insert(productData).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (variants && variants.length > 0) {
    const variantRows = variants.map(v => ({ ...v, product_id: product.id }))
    const { error: varError } = await admin.supabase.from("product_variants").insert(variantRows)
    if (varError) {
      await admin.supabase.from("products").delete().eq("id", product.id)
      return NextResponse.json({ error: varError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ product }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 })

  const body = await request.json()
  const parsed = ProductUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { variants, ...productData } = parsed.data
  const updateData = Object.fromEntries(
    Object.entries(productData).filter(([_, v]) => v !== undefined)
  )

  if (Object.keys(updateData).length > 0) {
    const { error } = await admin.supabase.from("products").update(updateData).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (variants) {
    await admin.supabase.from("product_variants").delete().eq("product_id", id)
    if (variants.length > 0) {
      const variantRows = variants.map(v => ({ ...v, product_id: id }))
      const { error: varError } = await admin.supabase.from("product_variants").insert(variantRows)
      if (varError) return NextResponse.json({ error: varError.message }, { status: 500 })
    }
  }

  const { data: product } = await admin.supabase.from("products").select("*").eq("id", id).single()
  return NextResponse.json({ product })
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin(request)
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 })

  await admin.supabase.from("product_variants").delete().eq("product_id", id)
  const { error } = await admin.supabase.from("products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
