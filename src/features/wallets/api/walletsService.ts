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
    // Check for mock balance in localStorage first (for testing)
    const mockWallets = localStorage.getItem('mock_wallets');
    if (mockWallets) {
      return JSON.parse(mockWallets);
    }

    try {
      const { data } = await apiClient.get('/wallets/me');
      return data;
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      return [];
    }
  },

  addMockFunds: async (currency: 'USD' | 'BTC', amount: number): Promise<void> => {
    const current = await walletsService.getMyWallets();
    const existing = current.find(w => w.currency === currency);
    
    let updated: Wallet[];
    if (existing) {
      updated = current.map(w => w.currency === currency 
        ? { ...w, balance: (parseFloat(w.balance) + amount).toString() }
        : w
      );
    } else {
      updated = [
        ...current,
        { id: `mock-${currency}-${Date.now()}`, userId: 'me', currency, balance: amount.toString() }
      ];
    }
    
    localStorage.setItem('mock_wallets', JSON.stringify(updated));
    // Trigger a storage event or just rely on manual refresh/state update in components
    window.dispatchEvent(new Event('storage'));
  }
};
