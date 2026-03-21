import apiClient from '../../../api/apiClient';

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: string; // Decimal string from backend
  address?: string;
}

export const walletsService = {
  getMyWallets: async (): Promise<Wallet[]> => {
    try {
      const { data } = await apiClient.get('/wallets/me');
      return data;
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      return [];
    }
  }
};
