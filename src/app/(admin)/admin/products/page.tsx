"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils"

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Premium Oversized Hoodie",
    slug: "premium-oversized-hoodie",
    price: 45000,
    stock: 25,
    category: "Hoodies",
    status: "active",
    image: "/products/hoodie-1.jpg",
  },
  {
    id: "2",
    name: "Streetwear Cargo Pants",
    slug: "streetwear-cargo-pants",
    price: 35000,
    stock: 30,
    category: "Pants",
    status: "active",
    image: "/products/cargo-1.jpg",
  },
  {
    id: "3",
    name: "Minimalist White Tee",
    slug: "minimalist-white-tee",
    price: 18000,
    stock: 50,
    category: "T-Shirts",
    status: "active",
    image: "/products/tee-1.jpg",
  },
  {
    id: "4",
    name: "Luxury Bomber Jacket",
    slug: "luxury-bomber-jacket",
    price: 85000,
    stock: 15,
    category: "Jackets",
    status: "active",
    image: "/products/jacket-1.jpg",
  },
  {
    id: "5",
    name: "Essential Sneakers",
    slug: "essential-sneakers",
    price: 42000,
    stock: 0,
    category: "Footwear",
    status: "out_of_stock",
    image: "/products/sneakers-1.jpg",
  },
]

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [products] = useState(mockProducts)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4 font-medium">{formatCurrency(product.price)}</td>
                    <td className="p-4">
                      <span className={product.stock <= 0 ? "text-red-500" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.status === "active"
                            ? "success"
                            : product.status === "out_of_stock"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {product.status === "active"
                          ? "Active"
                          : product.status === "out_of_stock"
                          ? "Out of Stock"
                          : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
