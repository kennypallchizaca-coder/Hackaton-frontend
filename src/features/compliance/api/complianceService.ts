import apiClient from '../../../api/apiClient';
import { type KYTAlert, type AuditEntry, type SelectiveDisclosurePayload, type ComplianceCheck, type Transaction } from '../../../types';

/**
 * Maps a raw backend ComplianceCheck record to a KYTAlert shape for the UI.
 * The backend `GET /compliance` returns ComplianceCheck objects; we adapt them here.
 */
function toKYTAlert(check: Record<string, unknown>): KYTAlert {
  return {
    id: check.id as string,
    txId: (check.paymentId || check.txId || check.id) as string,
    riskLevel: ((check.riskLevel as string) || 'Low') as KYTAlert['riskLevel'],
    reason: (check.reason as string) || 'Automated KYT check',
    walletAddress: (check.walletAddress as string) || '—',
    detectedAt: (check.createdAt || check.detectedAt || new Date().toISOString()) as string,
    resolved: !!(check.resolvedAt),
  };
}

export const complianceService = {
  /**
   * BUG-4 FIX: /compliance/alerts doesn't exist.
   * Backend uses GET /compliance (list) — we fetch that and return all items as KYTAlerts.
   */
  getAllAlerts: async (): Promise<KYTAlert[]> => {
    try {
      const { data } = await apiClient.get('/compliance');
      const items: Record<string, unknown>[] = Array.isArray(data)
        ? data
        : (data?.items ?? []);
      return items.map(toKYTAlert);
    } catch (error) {
      console.error('Failed to fetch compliance alerts:', error);
      return [];
    }
  },

  /**
   * BUG-3 FIX: /audit (wrong) → /audit/events (correct backend route).
   * Note: requires ADMIN or AUDITOR role; merchants will receive 403 and we return [].
   */
  getAuditLog: async (): Promise<AuditEntry[]> => {
    try {
      const { data } = await apiClient.get('/audit/events');
      const items: Record<string, unknown>[] = Array.isArray(data)
        ? data
        : (data?.items ?? []);
      return items.map((e) => ({
        id: e.id as string,
        timestamp: (e.createdAt || e.timestamp) as string,
        actor: (e.actorUserId || e.actor) as string,
        action: e.action as string,
        result: ((e.result as string) || 'success') as AuditEntry['result'],
        metadata: (e.details || e.metadata || {}) as Record<string, unknown>,
      }));
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
      return [];
    }
  },

  /**
   * BUG-7 FIX: backend route is POST /compliance/check/:paymentId (path param),
   * not POST /compliance/check with body only.
   */
  checkTransaction: async (txId: string): Promise<ComplianceCheck> => {
    try {
      const { data } = await apiClient.post(`/compliance/check/${txId}`, {});
      return data as ComplianceCheck;
    } catch (error) {
      console.error(`Compliance check failed for ${txId}:`, error);
      throw error;
    }
  },

  /**
   * BUG-5 FIX: /compliance/at-risk doesn't exist.
   * We fetch all compliance checks and filter for High/Medium risk client-side.
   */
  getAtRiskTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data } = await apiClient.get('/compliance');
      const items: Record<string, unknown>[] = Array.isArray(data)
        ? data
        : (data?.items ?? []);
      const atRisk = items.filter((c) =>
        c.riskLevel === 'High' || c.riskLevel === 'Medium'
      );
      // Map compliance checks to the Transaction shape expected by the UI
      return atRisk.map((c) => ({
        id: (c.paymentId || c.id) as string,
        date: (c.createdAt || new Date().toISOString()) as string,
        senderId: (c.actorUserId || '') as string,
        receiverId: '' as string,
        senderRole: 'consumer' as Transaction['senderRole'],
        receiverRole: 'merchant' as Transaction['receiverRole'],
        amountBTC: String(c.amountBTC || 0),
        amountUSD: (c.amountUSD || 0) as number,
        feeUSD: 0,
        type: 'payment_to_merchant' as Transaction['type'],
        status: 'completed' as Transaction['status'],
        compliance: {
          riskScore: (c.riskScore || 0) as number,
          riskLevel: (c.riskLevel || 'Low') as Transaction['compliance']['riskLevel'],
          kytStatus: 'flagged' as Transaction['compliance']['kytStatus'],
        },
      }));
    } catch (error) {
      console.error('Failed to fetch at-risk transactions:', error);
      return [];
    }
  },

  /**
   * BUG-6 FIX: backend route is POST /compliance/disclosures with body { paymentId },
   * NOT POST /compliance/disclosure/:txId (path param).
   */
  generateSelectiveDisclosure: async (txId: string): Promise<SelectiveDisclosurePayload> => {
    try {
      const { data } = await apiClient.post('/compliance/disclosures', { paymentId: txId });
      return data as SelectiveDisclosurePayload;
    } catch (error) {
      console.error('Failed to generate selective disclosure:', error);
      throw error;
    }
  },
};

