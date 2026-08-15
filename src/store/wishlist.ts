import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  ids: string[]
  isWishlisted: (productId: string) => boolean
  toggle: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      isWishlisted: (productId) => get().ids.includes(productId),
      toggle: (productId) =>
        set({
          ids: get().ids.includes(productId)
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        }),
      remove: (productId) =>
        set({ ids: get().ids.filter((id) => id !== productId) }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
)
