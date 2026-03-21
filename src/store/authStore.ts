import { create } from 'zustand';
import { type User, type AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, _password: string) => Promise<void>;
  logout: () => void;
  setAuthenticated: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('user_data') || 'null'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,

  setAuthenticated: (user: User, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API delay - In production, this call authService.login
    await new Promise(r => setTimeout(r, 1000));

    const mockUser: User = {
      id: 'usr_001',
      name: 'Kenny Pallchizaca',
      email: email,
      role: 'admin',
      merchantId: 'merchant_001',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

    set({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });

    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    set({ user: null, isAuthenticated: false, isLoading: false });
  }
}));
