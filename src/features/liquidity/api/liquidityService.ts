import apiClient from '../../../api/apiClient';
import { type LiquidityOrder } from '../../../types';

export const liquidityService = {
  getOrders: async (): Promise<LiquidityOrder[]> => {
    try {
      const { data } = await apiClient.get('/liquidity/orders');
      return Array.isArray(data) ? data : (data.items || []);
    } catch (error) {
      console.error('Failed to fetch liquidity orders:', error);
      return [];
    }
  },

  postOrder: async (order: Partial<LiquidityOrder>): Promise<LiquidityOrder> => {
    const { data } = await apiClient.post('/liquidity/orders', order);
    return data;
  }
};
