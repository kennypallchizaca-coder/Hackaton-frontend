import apiClient from '../../../api/apiClient';

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: string; // Decimal string from backend
  address?: string;
}

const DEMO_WALLETS: Wallet[] = [
  { id: 'demo-wallet-usd', userId: 'me', currency: 'USD', balance: '1500.00' },
  { id: 'demo-wallet-btc', userId: 'me', currency: 'BTC', balance: '0.25' },
];

const ensureArray = (data: unknown): Wallet[] => {
  if (Array.isArray(data)) return data as Wallet[];
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: Wallet[] }).items;
  }
  return [];
};

export const walletsService = {
  getMyWallets: async (): Promise<Wallet[]> => {
    const mockWallets = localStorage.getItem('mock_wallets');
    if (mockWallets) {
      try {
        const parsed = JSON.parse(mockWallets);
        const wallets = ensureArray(parsed);
        if (wallets.length > 0) return wallets;
      } catch {
        localStorage.removeItem('mock_wallets');
      }
    }

    try {
      const { data } = await apiClient.get('/wallets/me');
      const wallets = ensureArray(data);
      return wallets.length > 0 ? wallets : DEMO_WALLETS;
    } catch (error) {
      console.error('Failed to fetch wallets, using demo data:', error);
      return DEMO_WALLETS;
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
    window.dispatchEvent(new Event('storage'));
  }
};
