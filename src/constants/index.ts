export const SITE_NAME = 'Zero Limit'
export const SITE_DESCRIPTION = 'Premium Fashion E-commerce Platform'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Collections', href: '/collections' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const COLLECTIONS = [
  { name: 'Streetwear', slug: 'streetwear', image: '/collections/streetwear.jpg' },
  { name: 'Luxury', slug: 'luxury', image: '/collections/luxury.jpg' },
  { name: 'Essentials', slug: 'essentials', image: '/collections/essentials.jpg' },
  { name: 'New Drop', slug: 'new-drop', image: '/collections/new-drop.jpg' },
  { name: 'Limited Edition', slug: 'limited-edition', image: '/collections/limited-edition.jpg' },
]

export const CATEGORIES = [
  { name: 'Hoodies', slug: 'hoodies' },
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Shirts', slug: 'shirts' },
  { name: 'Cargo Pants', slug: 'cargo-pants' },
  { name: 'Shorts', slug: 'shorts' },
  { name: 'Jackets', slug: 'jackets' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Caps', slug: 'caps' },
]

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
