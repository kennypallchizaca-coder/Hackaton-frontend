import { type Transaction } from '../types';

export type { Transaction };

export const mockTransactions: Transaction[] = [
  {
    id: "tx_9f82d4",
    amountBTC: "0.00450000",
    amountSats: 450000,
    amountUSD: "$284.50",
    status: "completed",
    date: "2025-03-20T10:24:00Z",
    store: "Café Central",
    network: "Lightning",
    paymentHash: "lnbc4500n1p3q8...",
    invoiceRef: "INV-001",
    compliance: { kytRisk: 'Low', disputed: false, auditHash: "0xab3c..." }
  },
  {
    id: "tx_3a1b9c",
    amountBTC: "0.01250000",
    amountSats: 1250000,
    amountUSD: "$788.10",
    status: "pending",
    date: "2025-03-20T11:05:00Z",
    store: "Tienda Online",
    network: "On-Chain",
    paymentHash: "bc1q9f...",
    invoiceRef: "INV-002",
    compliance: { kytRisk: 'High', disputed: true, auditHash: "0xff1a..." }
  },
  {
    id: "tx_7c4d2e",
    amountBTC: "0.00015000",
    amountSats: 15000,
    amountUSD: "$9.45",
    status: "completed",
    date: "2025-03-20T15:30:00Z",
    store: "Café Central",
    network: "Lightning",
    paymentHash: "lnbc150n1p...",
    invoiceRef: "INV-003",
    compliance: { kytRisk: 'Low', disputed: false, proofOfInnocence: true }
  },
  {
    id: "tx_1a2b3c",
    amountBTC: "0.00890000",
    amountSats: 890000,
    amountUSD: "$561.00",
    status: "expired",
    date: "2025-03-20T09:15:00Z",
    store: "Tienda Online",
    network: "Lightning",
    invoiceRef: "INV-004",
    compliance: { kytRisk: 'Medium', disputed: false }
  },
  {
    id: "tx_5e6f7g",
    amountBTC: "0.15000000",
    amountSats: 15000000,
    amountUSD: "$9,450.00",
    status: "completed",
    date: "2025-03-19T14:20:00Z",
    store: "Sucursal Norte",
    network: "On-Chain",
    paymentHash: "bc1q7r...",
    invoiceRef: "INV-005",
    compliance: { kytRisk: 'Low', disputed: false, proofOfInnocence: true, selectiveDisclosed: true }
  },
  {
    id: "tx_9h8j7k",
    amountBTC: "0.00005000",
    amountSats: 5000,
    amountUSD: "$3.15",
    status: "completed",
    date: "2025-03-19T16:45:00Z",
    store: "Café Central",
    network: "Lightning",
    paymentHash: "lnbc50n1p...",
    invoiceRef: "INV-006",
    compliance: { kytRisk: 'Low', disputed: false }
  },
  {
    id: "tx_4d5e6f",
    amountBTC: "0.02300000",
    amountSats: 2300000,
    amountUSD: "$1,449.00",
    status: "failed",
    date: "2025-03-19T08:10:00Z",
    store: "Sucursal Norte",
    network: "Lightning",
    invoiceRef: "INV-007",
    compliance: { kytRisk: 'Medium', disputed: false }
  },
  {
    id: "tx_2b3c4d",
    amountBTC: "0.00078000",
    amountSats: 78000,
    amountUSD: "$49.14",
    status: "completed",
    date: "2025-03-18T13:22:00Z",
    store: "Sucursal Norte",
    network: "Lightning",
    paymentHash: "lnbc780n1p...",
    invoiceRef: "INV-008",
    compliance: { kytRisk: 'Low', disputed: false }
  },
];
