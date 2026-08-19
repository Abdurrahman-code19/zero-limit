import type { Product } from "@/types"

export const PRODUCTS: Product[] = [
  {
    id: "real-1",
    name: "Zero Limit Bernie",
    slug: "zero-limit-bernie",
    description:
      "The signature Zero Limit Bernie beanie. Knit to a snug, slouch-proof fit with a clean rolled cuff and an embroidered Zero Limit mark. Warm, durable, and cut to sit right on any head.",
    price: 13000,
    compare_at_price: undefined,
    images: [
      "/products/zero-limit-bernie-1.jpeg",
      "/products/zero-limit-bernie-2.jpeg",
      "/products/zero-limit-bernie-3.jpeg",
      "/products/zero-limit-bernie-4.jpeg",
    ],
    category_id: "caps",
    sizes: ["One Size"],
    colors: ["#111111", "#ffffff"],
    stock: 50,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "real-2",
    name: "Zero Limit Checkers Shirt",
    slug: "zero-limit-checkers-shirt",
    description:
      "A sharp checkered button-up from Zero Limit. Tailored fit with a straight collar and full front placket, woven in a premium cotton blend that holds its shape and breathes all day.",
    price: 25000,
    compare_at_price: undefined,
    images: [
      "/products/zero-limit-checkers-shirt-1.jpeg",
      "/products/zero-limit-checkers-shirt-2.jpeg",
      "/products/zero-limit-checkers-shirt-3.jpeg",
    ],
    category_id: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#111111", "#ffffff"],
    stock: 30,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "real-3",
    name: "Zero Limit Lightning Strike",
    slug: "zero-limit-lightning-strike",
    description:
      "A bold graphic piece from the Zero Limit line. Heavyweight cotton with a striking lightning motif, pre-shrunk and cut oversized for an effortless streetwear silhouette.",
    price: 23000,
    compare_at_price: undefined,
    images: ["/products/zero-limit-lightning-strike-1.jpeg"],
    category_id: "t-shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#111111", "#ffffff"],
    stock: 40,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "real-4",
    name: "Plain Zero Limit Polo",
    slug: "plain-zero-limit-polo",
    description:
      "The cleanest polo in the rotation. A crisp two-button placket, ribbed collar and cuffs, and a tonal Zero Limit chest embroidery. Minimal, premium, and built for every day.",
    price: 23000,
    compare_at_price: undefined,
    images: ["/products/plain-zero-limit-polo-1.jpeg"],
    category_id: "t-shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#ffffff", "#111111"],
    stock: 35,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "real-5",
    name: "Zero Limit Polo Shirt",
    slug: "zero-limit-polo-shirt",
    description:
      "The Zero Limit polo shirt drops in L, XL and XXL with the brand's signature detailing and premium fabric construction.",
    price: 25000,
    compare_at_price: undefined,
    images: [
      "/products/zero-limit-polo-shirt-1.jpeg",
      "/products/zero-limit-polo-shirt-2.jpeg",
      "/products/zero-limit-polo-shirt-3.jpeg",
      "/products/zero-limit-polo-shirt-4.jpeg",
    ],
    category_id: "t-shirts",
    sizes: ["L", "XL", "XXL"],
    colors: ["#ffffff", "#111111"],
    stock: 30,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "real-6",
    name: "Zero Limit Quarter Zip",
    slug: "zero-limit-quarter-zip",
    description:
      "A staple quarter-zip pullover from Zero Limit. Soft-touch fleece with a quarter-length zip, ribbed trims, and a clean branded finish. Layered-ready in L, XL and XXL.",
    price: 130000,
    compare_at_price: undefined,
    images: [
      "/products/zero-limit-quarter-zip-1.jpeg",
      "/products/zero-limit-quarter-zip-2.jpeg",
      "/products/zero-limit-quarter-zip-3.jpeg",
      "/products/zero-limit-quarter-zip-4.jpeg",
    ],
    category_id: "hoodies",
    sizes: ["L", "XL", "XXL"],
    colors: ["#111111", "#ffffff"],
    stock: 25,
    is_featured: false,
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "real-7",
    name: "Zero Limit Tank Top",
    slug: "zero-limit-tank-top",
    description:
      "The Zero Limit tank top. Lightweight and breathable with wide straps and a clean finish — made to move from gym floor to street without compromise.",
    price: 15000,
    compare_at_price: undefined,
    images: [
      "/products/zero-limit-tank-top-1.jpeg",
      "/products/zero-limit-tank-top-2.jpeg",
      "/products/zero-limit-tank-top-3.jpeg",
    ],
    category_id: "t-shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#111111", "#ffffff"],
    stock: 40,
    is_featured: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id).slice(0, count)
}

export function getProductTags(product: Product): string[] {
  const tags: string[] = []
  if (product.is_featured) tags.push("HOT")
  if (product.stock <= 0) tags.push("COMING SOON")
  return tags
}
