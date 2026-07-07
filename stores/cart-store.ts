import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-side cart — PRD Feature 2.
 * Persisted to localStorage so it survives page reload.
 */

export type CartItem = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string | null;
  price: number; // IDR, unit price at time of add
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

const sameLine = (
  a: Pick<CartItem, "productId" | "variantId">,
  productId: string,
  variantId: string | null,
) => a.productId === productId && a.variantId === variantId;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.variantId),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variantId)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, variantId),
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, productId, variantId))
              : state.items.map((i) =>
                  sameLine(i, productId, variantId) ? { ...i, quantity } : i,
                ),
        })),

      clear: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "koka-scent-cart",
      version: 1,
    },
  ),
);
