import apiClient from '../../../api/apiClient';
import { type Invoice, type PaymentStatus } from '../../../types';

const DEMO_PAYMENT_FALLBACK_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_PAYMENT_FALLBACK === 'true';

type ApiInvoicePayload = {
  id?: string;
  amount?: number;
  amountFiat?: number;
  amountSats?: number;
  amountSatsEstimate?: number;
  amountUsd?: number;
  description?: string;
  status?: string;
  lightningInvoice?: string;
  paymentRequest?: string;
  expiresAt?: string | number;
  createdAt?: string | number;
  merchantId?: string;
  merchantName?: string;
  items?: ApiInvoicePayload[];
};

function toInvoice(data: ApiInvoicePayload, fallback: Partial<Invoice> = {}): Invoice {
  return {
    id: data.id ?? fallback.id ?? '',
    amount: data.amountFiat ?? data.amount ?? fallback.amount ?? 0,
    amountSats: data.amountSatsEstimate ?? data.amountSats ?? fallback.amountSats ?? 0,
    amountUsd: data.amountFiat ?? data.amountUsd ?? fallback.amountUsd ?? 0,
    description: data.description ?? fallback.description ?? 'Merchant Payment',
    status: (data.status?.toLowerCase() || fallback.status || 'pending') as PaymentStatus,
    lightningInvoice: data.lightningInvoice ?? data.paymentRequest ?? fallback.lightningInvoice,
    expiresAt: data.expiresAt ? new Date(data.expiresAt).getTime() : fallback.expiresAt,
    createdAt: data.createdAt ? new Date(data.createdAt).getTime() : fallback.createdAt ?? Date.now(),
    store: data.merchantName ?? data.merchantId ?? fallback.store,
  };
}

function getStoredInvoice(id: string): Invoice | null {
  try {
    const stored = localStorage.getItem(`invoice_receipt_${id}`);
    return stored ? (JSON.parse(stored) as Invoice) : null;
  } catch {
    return null;
  }
}

function persistInvoice(invoice: Invoice): Invoice {
  localStorage.setItem(`invoice_receipt_${invoice.id}`, JSON.stringify(invoice));
  return invoice;
}

function updateStoredInvoiceStatus(invoiceId: string, status: PaymentStatus): void {
  const stored = getStoredInvoice(invoiceId);
  if (!stored) {
    return;
  }

  persistInvoice({ ...stored, status });
}

export const paymentService = {
  createInvoice: async (amountSats: number, description: string, merchantId: string): Promise<Invoice> => {
    try {
      const { data } = await apiClient.post('/payments/create', {
        amount: amountSats,
        description,
        merchantId,
        currency: 'BTC',
      });

      return persistInvoice(
        toInvoice(data, {
          amountSats,
          amountUsd: amountSats / 1587,
          description,
          store: merchantId,
        }),
      );
    } catch (error) {
      if (!DEMO_PAYMENT_FALLBACK_ENABLED) {
        throw error;
      }

      console.warn('Backend payment creation failed, providing mock fallback for demo mode:', error);
      // Mock invoice for seamless testing
      const mockInvoice: Invoice = {
        id: `mock-inv-${Math.floor(Math.random() * 1000000)}`,
        amount: amountSats / 1587, 
        amountSats: amountSats,
        amountUsd: amountSats / 1587,
        description: description,
        status: 'pending',
        lightningInvoice: `lnbc${amountSats}n1p...mock_lightning_invoice_for_testing_purposes`,
        expiresAt: Date.now() + 7200000, // 2 hours for demo mode
        createdAt: Date.now(),
        store: merchantId,
      };

      return persistInvoice(mockInvoice);
    }
  },

  checkPaymentStatus: async (invoiceId: string): Promise<PaymentStatus> => {
    // Check local mocks first (for testing)
    const mockPaid = JSON.parse(localStorage.getItem('mock_paid_invoices') || '[]');
    if (mockPaid.includes(invoiceId)) {
      updateStoredInvoiceStatus(invoiceId, 'paid');
      return 'paid';
    }

    try {
      const { data } = await apiClient.get(`/payments/${invoiceId}/status`);
      const status = data.status.toLowerCase() as PaymentStatus;
      updateStoredInvoiceStatus(invoiceId, status);
      return status;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return 'pending';
    }
  },

  simulatePayment: async (invoiceId: string): Promise<void> => {
    const mockPaid = JSON.parse(localStorage.getItem('mock_paid_invoices') || '[]');
    if (!mockPaid.includes(invoiceId)) {
      localStorage.setItem('mock_paid_invoices', JSON.stringify([...mockPaid, invoiceId]));
    }
    updateStoredInvoiceStatus(invoiceId, 'paid');
    // Trigger storage event to notify listeners (like PaymentsPage polling)
    window.dispatchEvent(new Event('storage'));
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
      const items = Array.isArray(data) ? (data as ApiInvoicePayload[]) : ((data?.items || []) as ApiInvoicePayload[]);
      return items.map((item) => toInvoice(item));
    } catch (error) {
      console.error('Failed to fetch recent payments:', error);
      return [];
    }
  },

  getInvoiceById: async (id: string): Promise<Invoice | null> => {
    const storedInvoice = getStoredInvoice(id);

    try {
      const { data } = await apiClient.get(`/payments/${id}`);
      return persistInvoice(toInvoice(data, storedInvoice ?? undefined));
    } catch (error) {
      console.error('Failed to get invoice by ID:', error);
      return storedInvoice;
    }
  }
};
