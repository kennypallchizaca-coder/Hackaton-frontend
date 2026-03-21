// ──────────────────────────────────────────────
// CORE DOMAIN TYPES
// ──────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';
export type PaymentNetwork = 'Lightning' | 'On-Chain';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type TxStatus = 'completed' | 'pending' | 'expired' | 'failed';

// ──────────────────────────────────────────────
// TRANSACTION
// ──────────────────────────────────────────────

export interface ComplianceInfo {
  kytRisk: RiskLevel;
  disputed: boolean;
  proofOfInnocence?: boolean;
  selectiveDisclosed?: boolean;
  auditHash?: string;
}

export interface Transaction {
  id: string;
  amountBTC: string;
  amountSats: number;
  amountUSD: string;
  status: TxStatus;
  date: string;
  store: string;
  network: PaymentNetwork;
  paymentHash?: string;
  invoiceRef?: string;
  compliance?: ComplianceInfo;
}

// ──────────────────────────────────────────────
// POS / INVOICE
// ──────────────────────────────────────────────

export interface Invoice {
  id: string;
  amountSats: number;
  amountUSD: number;
  description: string;
  status: PaymentStatus;
  lightningInvoice: string;
  expiresAt: number; // unix timestamp
  createdAt: number;
  store: string;
}

// ──────────────────────────────────────────────
// COMPLIANCE / KYT
// ──────────────────────────────────────────────

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
  actor: string; // e.g. "System" | "Admin" | "AI Agent"
  action: string;
  result: 'success' | 'warning' | 'error';
  metadata?: Record<string, string>;
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

// ──────────────────────────────────────────────
// GENLAYER
// ──────────────────────────────────────────────

export type AgentRole = 'RISK' | 'KYT' | 'SYSTEM' | 'CONTRACT';

export interface AgentLogEntry {
  agent: AgentRole;
  message: string;
  timestamp: string;
}

export interface DisputeCase {
  id: string;
  txId: string;
  status: 'frozen' | 'resolved' | 'under_review';
  heldAmountBTC: string;
  reason: string;
  merchantNode: string;
  merchantReputation: number; // 0-100
  createdAt: string;
  resolvedAt?: string;
  agentLogs: AgentLogEntry[];
}

// ──────────────────────────────────────────────
// AI INSIGHTS
// ──────────────────────────────────────────────

export interface AIInsight {
  id: string;
  type: 'summary' | 'anomaly' | 'recommendation';
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  generatedAt: string;
  icon?: string;
}

export interface DailySummary {
  date: string;
  totalRevenueBTC: string;
  totalRevenueUSD: string;
  totalTransactions: number;
  successRate: number;
  avgTicketUSD: number;
  topStore: string;
  insights: AIInsight[];
}

// ──────────────────────────────────────────────
// STORE / MERCHANT
// ──────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
  ruc: string; // Ecuador tax ID
  status: 'active' | 'suspended' | 'pending';
  btcAddress: string;
  lightningNode?: string;
  totalRevenueBTC: string;
  transactionsCount: number;
  createdAt: string;
}

// ──────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'viewer';
  merchantId: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ──────────────────────────────────────────────
// DASHBOARD METRICS
// ──────────────────────────────────────────────

export interface DashboardMetrics {
  totalRevenueTodayBTC: string;
  totalRevenueTodayUSD: string;
  totalTransactionsToday: number;
  successfulToday: number;
  failedToday: number;
  avgTicketUSD: number;
  activeAlerts: number;
  btcPriceUSD: number;
  btcChange24h: number;
}
