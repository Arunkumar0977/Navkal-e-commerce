import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  stock: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  couponCode: string | null;
  discount: number;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.color === item.color
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.color === item.color
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.color === color)
          ),
        });
      },

      updateQuantity: (id, quantity, color) => {
        if (quantity < 1) {
          get().removeItem(id, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.color === color ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      setCoupon: (code, discount) => set({ couponCode: code, discount }),
      removeCoupon: () => set({ couponCode: null, discount: 0 }),
    }),
    { name: "navkala-cart" }
  )
);

interface WishlistStore {
  items: Array<{ id: string; name: string; price: number; image: string; slug: string }>;
  addItem: (item: { id: string; name: string; price: number; image: string; slug: string }) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggle: (item: { id: string; name: string; price: number; image: string; slug: string }) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().isInWishlist(item.id)) {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      toggle: (item) => {
        if (get().isInWishlist(item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
    }),
    { name: "navkala-wishlist" }
  )
);
