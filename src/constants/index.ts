export const SITE_NAME = 'Zero Limit'
export const SITE_DESCRIPTION = 'Premium Fashion E-commerce Platform'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
]

export const PRODUCT_CATEGORIES = [
  { name: 'T-Shirts', slug: 't-shirts', image: '/products/zero-limit-lightning-strike-1.jpeg' },
  { name: 'Shirts', slug: 'shirts', image: '/products/zero-limit-checkers-shirt-1.jpeg' },
  { name: 'Caps & Beanies', slug: 'caps', image: '/products/zero-limit-bernie-1.jpeg' },
  { name: 'Hoodies & Quarter Zips', slug: 'hoodies', image: '/products/zero-limit-quarter-zip-1.jpeg' },
]

export const COLLECTIONS = PRODUCT_CATEGORIES

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
]

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const ADMIN_ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const
