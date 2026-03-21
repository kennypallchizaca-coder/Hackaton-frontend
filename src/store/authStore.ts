import { create } from 'zustand';
import { type User, type AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, _password: string) => Promise<void>;
  logout: () => void;
}

const mockUser: User = {
  id: 'usr_001',
  name: 'Kenny Rodriguez',
  email: 'merchant@kuripay.ec',
  role: 'admin',
  merchantId: 'merchant_001',
  avatarUrl: undefined
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 1000));
    set({
      user: { ...mockUser, email },
      isAuthenticated: true,
      isLoading: false
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  }
}));
