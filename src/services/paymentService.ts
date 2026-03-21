import { type Invoice, type PaymentStatus } from '../types';

let invoiceCounter = 9;

const generateLightningInvoice = (sats: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const random = Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `lnbc${sats}n1p${random}`;
};

export const paymentService = {
  createInvoice: (amountSats: number, description: string, store: string): Promise<Invoice> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        invoiceCounter++;
        const now = Date.now();
        resolve({
          id: `tx_inv${invoiceCounter}`,
          amountSats,
          amountUSD: parseFloat(((amountSats / 100_000_000) * 63012.50).toFixed(2)),
          description: description || `Order #${String(invoiceCounter).padStart(4, '0')}`,
          status: 'pending' as PaymentStatus,
          lightningInvoice: generateLightningInvoice(amountSats),
          expiresAt: now + 15 * 60 * 1000, // 15 minutes
          createdAt: now,
          store
        });
      }, 800);
    });
  },

  checkPaymentStatus: (invoiceId: string): Promise<PaymentStatus> => {
    // In a real app, this would poll the Lightning Node
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: simulate payment after a few seconds in demo
        const rand = Math.random();
        if (rand > 0.6) resolve('paid');
        else resolve('pending');
        console.log('Checking invoice:', invoiceId);
      }, 1000);
    });
  },

  regenerateInvoice: (original: Invoice): Promise<Invoice> => {
    return paymentService.createInvoice(original.amountSats, original.description, original.store);
  }
};
