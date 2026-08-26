export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  role: 'customer' | 'admin' | 'super_admin'
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  images: string[]
  category_id: string
  sizes: string[]
  colors: string[]
  stock: number
  variant_stock?: Record<string, number>
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  total: number
  subtotal: number
  shipping_cost: number
  discount: number
  shipping_address: Address
  payment_method: string
  payment_reference: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product: Product
  quantity: number
  size: string
  color: string
  price: number
}

export interface Address {
  id?: string
  label: string
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  phone: string
  is_default?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
  variant_id?: string
}

export interface WishlistItem {
  id: string
  product_id: string
  product: Product
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_purchase?: number
  max_uses?: number
  uses_count: number
  expires_at?: string
  is_active: boolean
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface DashboardStats {
  total_revenue: number
  total_orders: number
  total_products: number
  total_customers: number
  recent_orders: Order[]
  revenue_chart: { date: string; amount: number }[]
}
