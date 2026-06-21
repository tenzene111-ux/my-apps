import { create } from 'zustand';
import { api } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
}

interface CartItem {
  product: any;
  quantity: number;
  variant?: string;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  loadCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  cart: [],
  loading: false,

  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    api.setToken(data.token);
    set({ user: data.user });
    get().loadCart();
  },

  register: async (name, email, password, role) => {
    const data = await api.post('/auth/register', { name, email, password, role });
    api.setToken(data.token);
    set({ user: data.user });
  },

  logout: () => {
    api.setToken(null);
    set({ user: null, cart: [] });
  },

  loadUser: async () => {
    try {
      const user = await api.get('/auth/me');
      set({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch {
      api.setToken(null);
    }
  },

  loadCart: async () => {
    try {
      const cart = await api.get('/cart');
      set({ cart: cart.items || [] });
    } catch {}
  },

  addToCart: async (productId, quantity = 1) => {
    const cart = await api.post('/cart/add', { productId, quantity });
    set({ cart: cart.items });
  },

  removeFromCart: async (productId) => {
    const cart = await api.delete(`/cart/item/${productId}`);
    set({ cart: cart.items || [] });
  },

  updateCartItem: async (productId, quantity) => {
    const cart = await api.put(`/cart/item/${productId}`, { quantity });
    set({ cart: cart.items });
  },
}));
