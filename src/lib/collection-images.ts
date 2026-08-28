const BY_NAME: Record<string, string> = {
  "summer 2026": "/products/zero-limit-polo-shirt-1.jpeg",
  "limited edition": "/products/zero-limit-lightning-strike-1.jpeg",
  "the classics": "/products/zero-limit-checkers-shirt-1.jpeg",
}

const BY_INDEX = [
  "/products/zero-limit-polo-shirt-1.jpeg",
  "/products/zero-limit-lightning-strike-1.jpeg",
  "/products/zero-limit-checkers-shirt-1.jpeg",
]

export function collectionImage(name: string, index: number, dbImage?: string | null): string {
  if (dbImage) return dbImage
  return BY_NAME[name.trim().toLowerCase()] ?? BY_INDEX[index % BY_INDEX.length]
}
