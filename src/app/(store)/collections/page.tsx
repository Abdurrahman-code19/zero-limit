"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { COLLECTIONS } from "@/constants"

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-muted-foreground mt-2">
          Explore our curated collections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`}>
            <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{collection.name}</h2>
                  <p className="text-white/80 text-sm">Shop Now →</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
