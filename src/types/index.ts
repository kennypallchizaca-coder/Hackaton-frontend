/**
 * Comprehensive Type Definitions for KuriPay Frontend
 * Aligned with the NestJS Backend DTOs and existing UI components
 */

export type UserRole = 'admin' | 'merchant_owner' | 'cashier' | 'auditor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  merchantId?: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Merchant {
  id: string;
  name: string;
  country: string;
  taxId: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  amountSats?: number; // Added back for compatibility
  amountUsd?: number;
  description?: string;
  status: 'pending' | 'completed' | 'expired' | 'failed' | 'paid';
  lightningInvoice?: string;
  qrCode?: string;
  store?: string;
  createdAt: number | string;
  expiresAt?: number;
}

export type Invoice = PaymentOrder;
export type PaymentStatus = PaymentOrder['status'];

export interface Transaction {
  id: string;
  date: string;
  store: string;
  amountBTC: string;
  amountUSD: number;
  status: 'completed' | 'processing' | 'failed' | 'success'; 
  network?: string; // Added for Transactions.tsx
  compliance?: {
    kytRisk: 'Low' | 'Medium' | 'High';
    score: number;
    disputed?: boolean; // Added for Compliance.tsx
  };
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface KYTAlert {
  id: string;
  txId: string;
  riskLevel: RiskLevel;
  reason: string;
  detectedAt: string;
  walletAddress: string;
  resolved: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  result: 'success' | 'warning' | 'error';
  metadata: Record<string, any>;
}

export interface SelectiveDisclosurePayload {
  merchantId: string;
  txId: string;
  disclosureType: string;
  kycVerificationStatus: string;
  amlRiskScore: number;
  hiddenFields: string[];
  signature: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  type: 'summary' | 'anomaly' | 'recommendation';
  title: string;
  content: string;
  timestamp: string;
  impact?: 'positive' | 'negative' | 'neutral';
  icon?: string; // Added back for InsightCard
}

export interface DailySummary {
  date: string;
  totalVolume: number;
  transactionCount: number;
  topBranch: string;
  // Added back for AIInsights.tsx compatibility
  totalTransactions?: number;
  successRate?: number;
  avgTicketUSD?: number;
}

export interface DashboardMetrics {
  totalBalance: number;
  dailyVolume: number;
  activeTerminals: number;
  pendingAlerts: number;
}

export interface ComplianceCheck {
  id: string;
  paymentOrderId: string;
  riskScore: number;
  status: 'clear' | 'flagged' | 'blocked';
  kytProvider: string;
  evidenceUrl?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
