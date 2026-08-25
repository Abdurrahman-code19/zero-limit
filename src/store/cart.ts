import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size: string, color: string, variant_id?: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  updateItemPrice: (itemId: string, newPrice: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, size, color, variant_id) => {
        const items = get().items
        const existingItem = items.find(
          (item) => 
            item.product.id === product.id && 
            item.size === size && 
            item.color === color
        )

        if (existingItem) {
          const newQty = Math.min(product.stock, existingItem.quantity + quantity)
          set({
            items: items.map((item) =>
              item.product.id === product.id &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity: newQty }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity: Math.min(product.stock, quantity), size, color, variant_id }] })
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.size === size &&
                item.color === color
              )
          ),
        })
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color)
          return
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity: Math.min(item.product.stock, quantity) }
              : item
          ),
        })
      },

      updateItemPrice: (itemId, newPrice) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId
              ? { ...item, product: { ...item.product, price: newPrice } }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
