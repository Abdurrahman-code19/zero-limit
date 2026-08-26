export function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return isNaN(n) ? fallback : n
}

export function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback
}

export function safeObject<T extends Record<string, unknown>>(value: unknown, fallback: T = {} as T): T {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as T) : fallback
}

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
}
