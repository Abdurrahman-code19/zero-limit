"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "t-shirts": "Graphic tees, polos and tank tops — the everyday Zero Limit staples.",
  shirts: "Button-downs and checkered statement pieces that carry the fit.",
  caps: "The signature Zero Limit Bernie and more headwear to finish the look.",
  hoodies: "Quarter zips and layered pieces built for every season.",
}

export default function CollectionsPage() {
  const { products: allProducts, loading } = useProducts()
  const { categories: dbCategories } = useCategories()
  const available = allProducts.filter((p) => p.is_published)

  const collections = dbCategories
    .map((cat) => ({
      ...cat,
      products: available.filter((p) => p.category_id === cat.slug),
    }))
    .filter((cat) => cat.products.length > 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-4">Loading collections...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/store" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">Collections</span>
      </div>

      <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-muted mb-14">
        <img
          src="/products/zero-limit-checkers-shirt-1.jpeg"
          alt="Zero Limit Collections"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <p className="text-[10px] tracking-[0.5em] uppercase text-zinc-300 mb-3">Curated For You</p>
          <h1 className="text-3xl md:text-5xl font-light text-white mb-3">Collections</h1>
          <p className="text-sm text-zinc-300 max-w-md">
            Every piece in the Zero Limit lineup, grouped by what makes it work.
          </p>
        </div>
      </div>

      <div className="space-y-20">
        {collections.map((col, i) => (
          <section key={col.slug} id={col.slug}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">
                    Collection {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-light mb-2">{col.name}</h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {CATEGORY_DESCRIPTIONS[col.slug]}
                  </p>
                </div>
                <Link
                  href={`/shop?category=${col.slug}`}
                  className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 group shrink-0"
                >
                  View All
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {col.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  )
}
