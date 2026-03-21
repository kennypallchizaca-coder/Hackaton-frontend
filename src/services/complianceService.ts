// import api from './api';
import { type KYTAlert, type AuditEntry, type SelectiveDisclosurePayload, type ComplianceCheck, type Transaction } from '../types';
import { mockTransactions } from '../data/mockTransactions';

export const complianceService = {
  getAllAlerts: async (): Promise<KYTAlert[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([]), 500));
  },

  getAuditLog: async (): Promise<AuditEntry[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([]), 500));
  },

  checkTransaction: async (txId: string): Promise<ComplianceCheck> => {
    return {
      id: `check_${txId}`,
      paymentOrderId: txId,
      riskScore: 5,
      status: 'clear',
      kytProvider: 'Chainalysis/Internal',
      createdAt: new Date().toISOString()
    };
  },

  // RESTORED FOR COMPATIBILITY
  getAtRiskTransactions: async (): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve((mockTransactions as Transaction[]).filter(t => t.compliance?.kytRisk !== 'Low'));
      }, 500);
    });
  },

  generateSelectiveDisclosure: async (txId: string): Promise<SelectiveDisclosurePayload> => {
    return {
      merchantId: 'did:ethr:0x4f...8a',
      txId,
      disclosureType: 'selective_compliance',
      kycVerificationStatus: 'verified',
      amlRiskScore: 0.02,
      hiddenFields: ['origin_wallet'],
      signature: '0xfe3b8...91a2',
      timestamp: new Date().toISOString()
    };
  }
};
