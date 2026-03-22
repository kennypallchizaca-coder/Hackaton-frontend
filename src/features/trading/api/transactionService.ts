import apiClient from '../../../api/apiClient';
import { type Transaction, type UserRole } from '../../../types';

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    try {
      const { data } = await apiClient.get('/transactions');
      // Backend returns pagination matching standard NestJS patterns
      // Mapping backend transactions to frontend Transaction type
      const items = (Array.isArray(data) ? data : data?.items || []) as Array<{
        id: string;
        createdAt?: string;
        date?: string;
        senderUserId?: string;
        senderId?: string;
        receiverUserId?: string;
        receiverId?: string;
        senderRole?: string;
        receiverRole?: string;
        amountCrypto?: string;
        amountBTC?: string;
        amountFiat?: number;
        amountUSD?: number;
        feeFiat?: number;
        feeUSD?: number;
        type?: string;
        status?: string;
        riskScore?: number;
        riskLevel?: string;
        kytStatus?: string;
      }>;

      return items.map((tx) => ({
        id: tx.id,
        date: tx.createdAt || tx.date || new Date().toISOString(),
        senderId: tx.senderUserId || tx.senderId || '',
        receiverId: tx.receiverUserId || tx.receiverId || '',
        senderRole: (tx.senderRole?.toLowerCase() || 'consumer') as UserRole,
        receiverRole: (tx.receiverRole?.toLowerCase() || 'merchant') as UserRole,
        amountBTC: tx.amountCrypto || tx.amountBTC || '0',
        amountUSD: tx.amountFiat || tx.amountUSD || 0,
        feeUSD: tx.feeFiat || tx.feeUSD || 0,
        type: (tx.type?.toLowerCase() || 'merchant_payment') as Transaction['type'],
        status: (tx.status?.toLowerCase() || 'completed') as Transaction['status'],
        compliance: {
          riskScore: tx.riskScore || 0,
          riskLevel: (tx.riskLevel || 'Low') as Transaction['compliance']['riskLevel'],
          kytStatus: (tx.kytStatus?.toLowerCase() || 'clean') as Transaction['compliance']['kytStatus']
        }
      }));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    try {
      const { data } = await apiClient.get(`/transactions/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch transaction ${id}:`, error);
      return undefined;
    }
  },

  getByUser: async (userId: string): Promise<Transaction[]> => {
    try {
      const { data } = await apiClient.get(`/transactions?userId=${userId}`);
      const items = Array.isArray(data) ? data : data?.items || [];
      return items;
    } catch (error) {
      console.error(`Failed to fetch transactions for user ${userId}:`, error);
      return [];
    }
  }
};
