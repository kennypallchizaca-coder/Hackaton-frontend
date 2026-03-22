import apiClient from '../../../api/apiClient';

export interface MerchantStore {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  volume: string;
  terminals: number;
}

export const merchantsService = {
  getStores: async (): Promise<MerchantStore[]> => {
    try {
      const { data } = await apiClient.get('/merchants');
      // Map backend Merchant object to frontend MerchantStore UI type if needed
      // Assuming backend returns a list of merchant locations/stores
      const items = (Array.isArray(data) ? data : []) as Array<{
        id: string;
        businessName?: string;
        name?: string;
        address?: string;
        status?: string;
        monthlyVolume?: number;
        terminalCount?: number;
      }>;

      return items.map((m) => ({
        id: m.id,
        name: m.businessName || m.name || 'Unknown Store',
        location: m.address || 'Location not set',
        status: (m.status === 'ACTIVE' ? 'Active' : 'Maintenance') as MerchantStore['status'],
        volume: m.monthlyVolume?.toString() || '0.00',
        terminals: m.terminalCount || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      return [];
    }
  },

  getMerchantDetail: async (id: string) => {
    const { data } = await apiClient.get(`/merchants/${id}`);
    return data;
  }
};
