import type { Product } from "@/types"

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Minimalist Tailored Blazer",
    slug: "minimalist-tailored-blazer",
    description:
      "A sharp, unstructured blazer cut from a heavyweight twill. Engineered shoulders, a clean lapel, and a silhouette that moves from boardroom to rooftop without missing a beat.",
    price: 289,
    compare_at_price: 349,
    images: ["/products/minimalist-tailored-blazer.svg"],
    category_id: "luxury",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111111", "#c19a6b"],
    stock: 25,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Urban Classic Sneakers",
    slug: "urban-classic-sneakers",
    description:
      "Premium full-grain leather upper on a cushioned cupsole. A timeless street silhouette built for all-day wear with an understated logo hit at the heel.",
    price: 165,
    compare_at_price: 199,
    images: ["/products/urban-classic-sneakers.svg"],
    category_id: "footwear",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["#ffffff", "#1f2937", "#c0392b"],
    stock: 40,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Signature Crossbody Bag",
    slug: "signature-crossbody-bag",
    description:
      "A structured crossbody in pebbled leather with a tonal embossed monogram. Adjustable strap, interior zip pocket, and a magnetic closure that snaps with purpose.",
    price: 195,
    compare_at_price: 240,
    images: ["/products/signature-crossbody-bag.svg"],
    category_id: "accessories",
    sizes: ["One Size"],
    colors: ["#78350f", "#0f172a", "#111111"],
    stock: 18,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Merino Wool Knit Sweater",
    slug: "merino-wool-knit-sweater",
    description:
      "Featherweight 12-gauge merino that keeps you warm without the bulk. Ribbed trims, a relaxed crew neck, and a drape that stays sharp season after season.",
    price: 145,
    compare_at_price: 175,
    images: ["/products/merino-wool-knit-sweater.svg"],
    category_id: "luxury",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#e5e7eb", "#374151", "#92400e"],
    stock: 30,
    is_featured: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Cargo Utility Jacket",
    slug: "cargo-utility-jacket",
    description:
      "Four-pocket utility jacket in a water-repellent cotton ripstop. Adjustable cuffs, a hidden zip storm flap, and hardware that means business.",
    price: 225,
    compare_at_price: 275,
    images: ["/products/cargo-utility-jacket.svg"],
    category_id: "streetwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#1c1917", "#3f3f46", "#57534e"],
    stock: 22,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Slim Fit Denim",
    slug: "slim-fit-denim",
    description:
      "Japanese 13oz selvedge denim with a modern slim taper. A touch of stretch for movement, finished with tonal stitching and a branded leather patch.",
    price: 120,
    compare_at_price: 150,
    images: ["/products/slim-fit-denim.svg"],
    category_id: "streetwear",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["#1e3a5f", "#0f172a", "#374151"],
    stock: 35,
    is_featured: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Oversized Graphic Tee",
    slug: "oversized-graphic-tee",
    description:
      "Boxy heavyweight tee in 240gsm cotton with a distressed screen-printed graphic. Pre-shrunk, drop-shoulder, and loud enough to say it for you.",
    price: 65,
    compare_at_price: 85,
    images: ["/products/oversized-graphic-tee.svg"],
    category_id: "streetwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#111111", "#f4f4f5", "#7f1d1d"],
    stock: 50,
    is_featured: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Leather Chelsea Boots",
    slug: "leather-chelsea-boots",
    description:
      "Hand-finished leather chelsea boot on a stacked leather sole. Elastic gussets, a pointed almond toe, and a patina that only gets better with wear.",
    price: 245,
    compare_at_price: 299,
    images: ["/products/leather-chelsea-boots.svg"],
    category_id: "footwear",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["#1c1917", "#292524"],
    stock: 20,
    is_featured: true,
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
  if (Number(product.id) % 2 === 1) tags.push("NEW")
  return tags
}
