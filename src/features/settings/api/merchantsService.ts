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
      return Array.isArray(data) ? data.map((m: any) => ({
        id: m.id,
        name: m.businessName || m.name,
        location: m.address || 'Location not set',
        status: m.status === 'ACTIVE' ? 'Active' : 'Maintenance',
        volume: m.monthlyVolume?.toString() || '0.00',
        terminals: m.terminalCount || 0,
      })) : [];
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
