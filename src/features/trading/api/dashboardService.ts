import apiClient from '../../../api/apiClient';
import { type DashboardMetrics, type DailySummary, type Transaction } from '../../../types';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const { data } = await apiClient.get('/users/me/metrics'); 
      return data;
    } catch {
      return {
        totalBalance: 0,
        dailyVolume: 0,
        activeTerminals: 0,
        pendingAlerts: 0
      };
    }
  },

  getDailySummary: async (): Promise<DailySummary> => {
    try {
      const { data } = await apiClient.get('/users/me/summary');
      return data;
    } catch {
      return {
        date: new Date().toISOString(),
        totalVolume: 0,
        transactionCount: 0,
        activeAgents: 0
      };
    }
  },

  getRecentTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data } = await apiClient.get('/transactions?limit=5');
      const items = Array.isArray(data) ? data : data.items || [];
      return items;
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      return [];
    }
  }
};
