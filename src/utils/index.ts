import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function generateOrderId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2)
  return `ZL-${timestamp}-${random}`.toUpperCase()
}
