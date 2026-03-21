import { type Transaction } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: "tx_9f82d4",
    amountBTC: "0.00450000",
    amountUSD: 284.50,
    status: "completed",
    date: "2025-03-20T10:24:00Z",
    store: "Café Central",
    network: "Lightning",
    compliance: { kytRisk: 'Low', score: 5, disputed: false }
  },
  {
    id: "tx_3a1b9c",
    amountBTC: "0.01250000",
    amountUSD: 788.10,
    status: "processing",
    date: "2025-03-20T11:05:00Z",
    store: "Tienda Online",
    network: "On-Chain",
    compliance: { kytRisk: 'High', score: 87, disputed: true }
  },
  {
    id: "tx_7c4d2e",
    amountBTC: "0.00015000",
    amountUSD: 9.45,
    status: "completed",
    date: "2025-03-20T15:30:00Z",
    store: "Café Central",
    network: "Lightning",
    compliance: { kytRisk: 'Low', score: 2, disputed: false }
  },
  {
    id: "tx_1a2b3c",
    amountBTC: "0.00890000",
    amountUSD: 561.00,
    status: "failed",
    date: "2025-03-20T09:15:00Z",
    store: "Tienda Online",
    network: "Lightning",
    compliance: { kytRisk: 'Medium', score: 45, disputed: false }
  },
  {
    id: "tx_5e6f7g",
    amountBTC: "0.15000000",
    amountUSD: 9450.00,
    status: "completed",
    date: "2025-03-19T14:20:00Z",
    store: "Sucursal Norte",
    network: "On-Chain",
    compliance: { kytRisk: 'Low', score: 12, disputed: false }
  }
];
