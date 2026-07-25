"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/store/product-card"
import { formatCurrency } from "@/utils"
import { useCartStore } from "@/store/cart"
import type { Product } from "@/types"

// Mock product data
const mockProduct: Product = {
  id: "1",
  name: "Premium Oversized Hoodie",
  slug: "premium-oversized-hoodie",
  description: "Luxurious oversized hoodie crafted from premium cotton blend. This piece features a relaxed fit with ribbed cuffs and hem, perfect for layering or wearing on its own. The heavyweight fabric ensures warmth and durability while maintaining a soft, comfortable feel against the skin.",
  price: 45000,
  compare_at_price: 55000,
  images: ["/products/hoodie-1.jpg", "/products/hoodie-2.jpg", "/products/hoodie-3.jpg"],
  category_id: "1",
  collection_id: "1",
  sizes: ["S", "M", "L", "XL"],
  colors: ["#000000", "#FFFFFF", "#1a1a1a"],
  stock: 25,
  is_featured: true,
  is_published: true,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
}

const relatedProducts: Product[] = [
  {
    id: "2",
    name: "Streetwear Cargo Pants",
    slug: "streetwear-cargo-pants",
    description: "Durable cargo pants with multiple pockets",
    price: 35000,
    images: ["/products/cargo-1.jpg"],
    category_id: "2",
    collection_id: "1",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000"],
    stock: 30,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "3",
    name: "Minimalist White Tee",
    slug: "minimalist-white-tee",
    description: "Clean and crisp white t-shirt",
    price: 18000,
    images: ["/products/tee-1.jpg"],
    category_id: "3",
    collection_id: "2",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FFFFFF"],
    stock: 50,
    is_featured: false,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "4",
    name: "Luxury Bomber Jacket",
    slug: "luxury-bomber-jacket",
    description: "Premium bomber jacket with satin lining",
    price: 85000,
    images: ["/products/jacket-1.jpg"],
    category_id: "4",
    collection_id: "2",
    sizes: ["M", "L", "XL"],
    colors: ["#000000"],
    stock: 15,
    is_featured: true,
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

export default function ProductDetailsPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  const product = mockProduct
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    addItem(product, quantity, selectedSize, selectedColor)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Shop</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                -{discountPercent}%
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="w-full h-full bg-muted" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.compare_at_price!)}
                  </span>
                )}
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="warning">Only {product.stock} left</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-3">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Size</h3>
              <button className="text-sm text-primary hover:underline">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[60px] px-4 py-2 text-sm border rounded-md ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 hover:bg-muted"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 hover:bg-muted"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} in stock
              </span>
            </div>
          </div>

          {/* Add to Cart & Wishlist */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || product.stock <= 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Easy Returns</span>
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-muted-foreground">
              {product.description}
            </TabsContent>
            <TabsContent value="details" className="text-muted-foreground space-y-2">
              <p>• 80% Cotton, 20% Polyester</p>
              <p>• Heavyweight 350gsm fabric</p>
              <p>• Relaxed oversized fit</p>
              <p>• Ribbed cuffs and hem</p>
              <p>• Kangaroo pocket</p>
              <p>• Machine washable</p>
            </TabsContent>
            <TabsContent value="shipping" className="text-muted-foreground space-y-2">
              <p>• Free shipping on orders over ₦50,000</p>
              <p>• Standard delivery: 3-5 business days</p>
              <p>• Express delivery: 1-2 business days</p>
              <p>• 7-day return policy</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
