import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import ProductContent from "./product-content"

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(50)

  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, description, images, price")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    return { title: "Product Not Found" }
  }

  const title = `${product.name} | Zero Limit`
  const description = product.description?.slice(0, 160) ?? product.name
  const image = product.images?.[0]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ProductContent slug={slug} />
}
