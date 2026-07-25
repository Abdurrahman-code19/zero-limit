"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Truck, Shield, RotateCcw, CreditCard } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            ZERO LIMIT
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Premium fashion for the bold and confident. No limits, just style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <Truck className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders over ₦50,000</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">100% secure checkout</p>
            </div>
            <div className="space-y-2">
              <RotateCcw className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-muted-foreground">7-day return policy</p>
            </div>
            <div className="space-y-2">
              <CreditCard className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Flexible Payment</p>
              <p className="text-xs text-muted-foreground">Pay with Paystack</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Collections</h2>
            <p className="text-muted-foreground mt-2">Discover our curated collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Streetwear", "Luxury", "Essentials"].map((collection) => (
              <Link key={collection} href={`/collections/${collection.toLowerCase()}`}>
                <Card className="overflow-hidden group cursor-pointer">
                  <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{collection}</h3>
                      <p className="text-sm text-white/80">Shop Now</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <p className="text-muted-foreground mt-2">Fresh drops just for you</p>
            </div>
            <Link href="/shop?sort=newest">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden group cursor-pointer">
                <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">Premium Hoodie {i}</h3>
                  <p className="text-sm text-muted-foreground">₦25,000</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive drops, offers, and style inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
