import { type DashboardMetrics, type DailySummary, type AIInsight } from '../types';
import { mockTransactions } from '../data/mockTransactions';

const aiInsights: AIInsight[] = [
  {
    id: 'ins_001',
    type: 'summary',
    title: 'Excelente jornada de ventas',
    content: 'Hoy procesaste 6 transacciones por un total de $1,004.64 USD. Tu volumen aumentó un 18% respecto al día anterior.',
    timestamp: new Date().toISOString(),
    impact: 'positive'
  },
  {
    id: 'ins_002',
    type: 'anomaly',
    title: 'Patrón inusual detectado',
    content: 'La transacción tx_3a1b9c supera 3.2x el ticket promedio de tu sucursal Tienda Online.',
    timestamp: new Date().toISOString(),
    impact: 'negative'
  },
  {
    id: 'ins_003',
    type: 'recommendation',
    title: 'Optimiza horarios de caja',
    content: 'El 72% de tus pagos Lightning se procesan entre las 10:00 y 14:00.',
    timestamp: new Date().toISOString(),
    impact: 'neutral'
  }
];

export const dashboardService = {
  getMetrics: (): Promise<DashboardMetrics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalBalance: 125000.50,
          dailyVolume: 1085.20,
          activeTerminals: 6,
          pendingAlerts: 2
        });
      }, 500);
    });
  },

  getDailySummary: (): Promise<DailySummary> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          date: new Date().toISOString(),
          totalVolume: 1085.20,
          transactionCount: 6,
          topBranch: 'Café Central'
        });
      }, 800);
    });
  },

  getRecentTransactions: (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions);
      }, 400);
    });
  }
};

export const aiService = {
  getInsights: (): Promise<AIInsight[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(aiInsights), 900);
    });
  },

  askQuestion: (_question: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Tus transacciones Lightning Network tienen una tasa de éxito del 92.3%.');
      }, 1500);
    });
  }
};
