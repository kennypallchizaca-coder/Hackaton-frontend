import { create } from 'zustand';
import { type User, type AuthState, type UserRole } from '../../../types';
import apiClient from '../../../api/apiClient';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  setAuthenticated: (user: User, accessToken: string, refreshToken: string) => void;
}

const mapBackendRole = (roles: string[]): UserRole => {
  if (!roles || !Array.isArray(roles) || roles.length === 0) return 'consumer';
  
  const role = roles[0].toLowerCase();
  if (role === 'admin' || role === 'merchant' || role === 'consumer') {
    return role as UserRole;
  }
  if (role === 'agent' || role === 'liquidity_agent' || role === 'transaccionador') {
    return 'transaccionador';
  }
  return 'consumer';
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('user_data') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  setAuthenticated: (user: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user_data', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  initAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    if (token === 'hackathon-demo-token') {
      const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
      if (userData) {
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
      return;
    }

    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/auth/me');
      
      const mappedUser: User = {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: mapBackendRole(data.roles),
        status: data.status,
        createdAt: data.createdAt,
        balance: {
          fiat: 0, // Will be fetched via wallets service
          crypto: 0
        }
      };

      set({ user: mappedUser, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user_data', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Auth initialization failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user_data');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { data } = response;
      if (!data?.tokens || !data?.user) {
        throw new Error('Credenciales o respuesta invalida');
      }

      const { accessToken, refreshToken } = data.tokens;
      const backendUser = data.user;

      const mappedUser: User = {
        id: backendUser.id,
        name: backendUser.fullName,
        email: backendUser.email,
        role: mapBackendRole(backendUser.roles),
        status: backendUser.status,
        createdAt: backendUser.createdAt,
        balance: {
          fiat: 0,
          crypto: 0
        }
      };

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(mappedUser));

      set({
        user: mappedUser,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      // HACKATHON FALLBACK: Guarantee demo accounts work even if backend is not seeded/running
      const isDemo = ['owner@demo.ec', 'agent@demo.com', 'consumer@demo.com'].includes(email);
      if (isDemo) {
        console.warn('Backend login failed, using resilient frontend mock for demo account:', email);
        const role = email.includes('owner') ? 'merchant' : email.includes('agent') ? 'transaccionador' : 'consumer';
        const mappedUser: User = {
          id: `demo-id-${role}`,
          name: role === 'merchant' ? 'Demo Local' : role === 'transaccionador' ? 'Agente de Liquidez' : 'Demo Consumidor',
          email,
          role: role as UserRole,
          status: 'active',
          merchantId: role === 'merchant' ? 'demo-store-1' : undefined,
          createdAt: new Date().toISOString(),
          balance: { fiat: 1500, crypto: 0.25 }
        };
        localStorage.setItem('accessToken', 'hackathon-demo-token');
        localStorage.setItem('refreshToken', 'hackathon-demo-token');
        localStorage.setItem('user_data', JSON.stringify(mappedUser));
        set({ user: mappedUser, isAuthenticated: true, isLoading: false });
        return;
      }

      set({ isLoading: false });
      throw error;
    }
  },

  register: async (fullName: string, email: string, password: string, role: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/register', { 
        fullName, 
        email, 
        password, 
        role: role.toLowerCase() // Ensure matches backend PlatformRole enum
      });
      
      const { data } = response;
      if (!data?.tokens || !data?.user) {
        throw new Error('Respuesta del servidor invalida');
      }

      const { accessToken, refreshToken } = data.tokens;
      const backendUser = data.user;

      const mappedUser: User = {
        id: backendUser.id,
        name: backendUser.fullName,
        email: backendUser.email,
        role: mapBackendRole(backendUser.roles),
        status: backendUser.status,
        createdAt: backendUser.createdAt,
        balance: { fiat: 0, crypto: 0 }
      };

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(mappedUser));

      set({
        user: mappedUser,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user_data');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
