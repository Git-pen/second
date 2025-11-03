import { create } from 'zustand';
import api from '@/lib/api';
import { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  fetchCart: async () => {
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data.cart });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ isLoading: true });
    try {
      await api.post('/cart', { productId, quantity });
      await get().fetchCart();
      set({ isLoading: false, isOpen: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      await get().fetchCart();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/cart/${itemId}`);
      await get().fetchCart();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/cart');
      set({ cart: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
