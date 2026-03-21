import apiClient from '../../../api/apiClient';
import { type Invoice, type PaymentStatus } from '../../../types';

export const paymentService = {
  createInvoice: async (amountSats: number, description: string, merchantId: string): Promise<Invoice> => {
    try {
      const { data } = await apiClient.post('/payments/create', {
        amount: amountSats,
        description,
        merchantId,
        currency: 'BTC',
      });
      
      return {
        id: data.id,
        amount: data.amount,
        amountSats: data.amountSats || amountSats,
        amountUsd: data.amountUsd || 0,
        description: data.description || description,
        status: data.status.toLowerCase() as any,
        lightningInvoice: data.lightningInvoice || data.paymentRequest,
        expiresAt: new Date(data.expiresAt).getTime(),
        createdAt: new Date(data.createdAt).getTime(),
        store: data.merchantId,
      };
    } catch (error) {
      console.error('Failed to create payment order:', error);
      throw error;
    }
  },

  checkPaymentStatus: async (invoiceId: string): Promise<PaymentStatus> => {
    try {
      const { data } = await apiClient.get(`/payments/${invoiceId}/status`);
      return data.status.toLowerCase() as PaymentStatus;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return 'pending';
    }
  },

  regenerateInvoice: async (original: Invoice): Promise<Invoice> => {
    try {
      const { data } = await apiClient.post(`/payments/${original.id}/regenerate`, {
        reason: 'User requested refresh'
      });
      return {
        ...original,
        lightningInvoice: data.lightningInvoice || data.paymentRequest,
        expiresAt: new Date(data.expiresAt).getTime(),
      };
    } catch (error) {
      console.error('Failed to regenerate invoice:', error);
      return original;
    }
  },

  getRecentPayments: async (): Promise<Invoice[]> => {
    try {
      const { data } = await apiClient.get('/payments');
      const items = Array.isArray(data) ? data : (data?.items || []);
      return items.map((data: any) => ({
        id: data.id,
        amount: data.amountFiat || data.amount || 0,
        amountSats: data.amountSatsEstimate || data.amountSats || 0,
        amountUsd: data.amountFiat || 0,
        description: data.description || 'Merchant Payment',
        status: (data.status?.toLowerCase() || 'pending') as any,
        lightningInvoice: data.lightningInvoice,
        expiresAt: new Date(data.expiresAt).getTime(),
        createdAt: new Date(data.createdAt).getTime(),
        store: data.merchantId,
      }));
    } catch (error) {
      console.error('Failed to fetch recent payments:', error);
      return [];
    }
  }
};
