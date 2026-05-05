// src/hooks/useAuth.js
import { create } from 'zustand';
import { authApi } from '../utils/api';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    set({ user: res.data.user, isAuthenticated: true });
    return res.data;
  },

  register: async (email, password, confirmPassword) => {
    const res = await authApi.register({ email, password, confirmPassword });
    set({ user: res.data.user, isAuthenticated: true });
    return res.data;
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
