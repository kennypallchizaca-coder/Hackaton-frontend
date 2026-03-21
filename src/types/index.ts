export type UserRole = 'consumer' | 'liquidity_agent' | 'merchant' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  merchantId?: string; // For merchant role
  agentId?: string;    // For agent role
  status: 'active' | 'inactive' | 'pending';
  avatarUrl?: string;
  createdAt: string;
  balance: {
    fiat: number;
    crypto: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  senderId: string;
  receiverId: string;
  senderRole: UserRole;
  receiverRole: UserRole;
  amountBTC: string;
  amountUSD: number;
  feeUSD: number;
  type: 'buy_crypto' | 'sell_crypto' | 'merchant_payment' | 'inter_merchant_payment' | 'fiat_bridge';
  status: 'completed' | 'processing' | 'failed' | 'paid' | 'expired';
  compliance: {
    riskScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    evidenceUrl?: string;
    kytStatus: 'clean' | 'flagged' | 'manual_review';
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
  topBranch?: string;
  activeAgents?: number;
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

export interface LiquidityOrder {
  id: string;
  agentId: string;
  type: 'buy' | 'sell';
  amountBTC: string;
  rateUSD: number;
  minAmountUSD: number;
  maxAmountUSD: number;
  status: 'active' | 'filled' | 'cancelled';
}
