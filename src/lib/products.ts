import type { Product } from "@/types"

export function getProductTags(product: Product): string[] {
  const tags: string[] = []
  if (product.is_featured) tags.push("HOT")
  if (product.stock <= 0) tags.push("COMING SOON")
  return tags
}
