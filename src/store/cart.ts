import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, size, color) => {
        const items = get().items
        const existingItem = items.find(
          (item) => 
            item.product.id === product.id && 
            item.size === size && 
            item.color === color
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity, size, color }] })
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
              ? { ...item, quantity }
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
