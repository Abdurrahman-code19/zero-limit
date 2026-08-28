import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

const base = "https://www.zerolimit.store"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/store`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/size-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  let productPages: MetadataRoute.Sitemap = []

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true)

    if (products) {
      productPages = products.map((p) => ({
        url: `${base}/product/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    }
  } catch {
    // Fall back to static sitemap if DB fetch fails
  }

  return [...staticPages, ...productPages]
}
