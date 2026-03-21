// import api from './api';
import { type Invoice, type PaymentStatus } from '../types';

export const paymentService = {
  createInvoice: async (amountSats: number, description: string, store: string): Promise<Invoice> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `tx_inv_${Date.now()}`,
          amount: amountSats,
          amountSats, // Restore for UI compatibility
          amountUsd: parseFloat(((amountSats / 100_000_000) * 65000).toFixed(2)),
          description: description || 'New POS Order',
          status: 'pending',
          lightningInvoice: `lnbc${amountSats}n1p...mock`,
          expiresAt: Date.now() + 15 * 60 * 1000,
          createdAt: Date.now(),
          store
        });
      }, 800);
    });
  },

  checkPaymentStatus: async (_invoiceId: string): Promise<PaymentStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.8 ? 'paid' : 'pending'), 1000);
    });
  },

  // RESTORED FOR COMPATIBILITY
  regenerateInvoice: async (original: Invoice): Promise<Invoice> => {
    return paymentService.createInvoice(original.amountSats || 0, original.description || '', original.store || '');
  }
};
