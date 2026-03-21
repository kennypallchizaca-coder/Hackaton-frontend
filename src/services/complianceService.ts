import { type KYTAlert, type AuditEntry, type SelectiveDisclosurePayload } from '../types';
import { mockTransactions } from '../data/mockTransactions';

const mockKYTAlerts: KYTAlert[] = [
  {
    id: 'alert_001',
    txId: 'tx_3a1b9c',
    riskLevel: 'High',
    reason: 'Wallet linked to high-risk jurisdiction. Unusual transaction volume.',
    detectedAt: '2025-03-20T11:10:00Z',
    walletAddress: 'bc1q9f8a2d3e...',
    resolved: false
  },
  {
    id: 'alert_002',
    txId: 'tx_1a2b3c',
    riskLevel: 'Medium',
    reason: 'Multiple small transactions (structuring pattern) within 1 hour.',
    detectedAt: '2025-03-20T09:20:00Z',
    walletAddress: 'lnbc89...',
    resolved: false
  },
  {
    id: 'alert_003',
    txId: 'tx_4d5e6f',
    riskLevel: 'Medium',
    reason: 'Payment origin could not be fully traced on-chain.',
    detectedAt: '2025-03-19T08:15:00Z',
    walletAddress: 'lnbc230...',
    resolved: true
  }
];

const mockAuditLog: AuditEntry[] = [
  {
    id: 'audit_001',
    timestamp: '2025-03-20T11:12:00Z',
    actor: 'AI Agent (KYT)',
    action: 'Flagged tx_3a1b9c as High Risk',
    result: 'warning',
    metadata: { risk_score: '0.87', rule_triggered: 'R-042' }
  },
  {
    id: 'audit_002',
    timestamp: '2025-03-20T11:15:00Z',
    actor: 'System',
    action: 'Frozen tx_3a1b9c pending compliance review',
    result: 'warning',
    metadata: { hold_amount: '0.01250000 BTC' }
  },
  {
    id: 'audit_003',
    timestamp: '2025-03-20T11:30:00Z',
    actor: 'Admin (Kenny R.)',
    action: 'Requested Selective Disclosure Proof for tx_3a1b9c',
    result: 'success',
    metadata: { disclosure_id: 'sd_8f9a...' }
  },
  {
    id: 'audit_004',
    timestamp: '2025-03-20T12:00:00Z',
    actor: 'GenLayer Smart Contract',
    action: 'Multi-agent consensus: Merchant reputation 94/100. No dark market links.',
    result: 'success',
    metadata: { agents_voting: '3/3', contract_id: '0x9c3a...' }
  },
  {
    id: 'audit_005',
    timestamp: '2025-03-19T09:20:00Z',
    actor: 'AI Agent (KYT)',
    action: 'Cleared tx_4d5e6f after manual review. Medium risk accepted.',
    result: 'success',
    metadata: { reviewed_by: 'Admin', risk_score: '0.44' }
  }
];

export const complianceService = {
  getAtRiskTransactions: (): Promise<typeof mockTransactions> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions.filter(t => t.compliance?.kytRisk !== 'Low'));
      }, 800);
    });
  },

  getAllAlerts: (): Promise<KYTAlert[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockKYTAlerts), 600);
    });
  },

  getAuditLog: (): Promise<AuditEntry[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAuditLog), 700);
    });
  },

  generateSelectiveDisclosure: (txId: string): Promise<SelectiveDisclosurePayload> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          merchantId: 'did:ethr:0x4f...8a',
          txId,
          disclosureType: 'selective_compliance',
          kycVerificationStatus: 'verified',
          amlRiskScore: 0.02,
          hiddenFields: ['origin_wallet', 'customer_routing', 'counterparty_ip'],
          signature: '0xfe3b8...91a2',
          timestamp: new Date().toISOString()
        });
      }, 1200);
    });
  }
};
