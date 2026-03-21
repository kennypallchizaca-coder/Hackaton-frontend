import { type DashboardMetrics, type DailySummary, type AIInsight } from '../types';

const aiInsights: AIInsight[] = [
  {
    id: 'ins_001',
    type: 'summary',
    title: 'Excelente jornada de ventas',
    body: 'Hoy procesaste 6 transacciones por un total de $1,004.64 USD. Tu volumen aumentó un 18% respecto al día anterior.',
    priority: 'low',
    generatedAt: new Date().toISOString(),
    icon: '📈'
  },
  {
    id: 'ins_002',
    type: 'anomaly',
    title: 'Patrón inusual detectado',
    body: 'La transacción tx_3a1b9c supera 3.2x el ticket promedio de tu sucursal Tienda Online. Se recomienda revisión de compliance antes de liberar fondos.',
    priority: 'high',
    generatedAt: new Date().toISOString(),
    icon: '⚠️'
  },
  {
    id: 'ins_003',
    type: 'recommendation',
    title: 'Optimiza horarios de caja',
    body: 'El 72% de tus pagos Lightning se procesan entre las 10:00 y 14:00. Considera asignar más personal en ese rango para reducir tiempos de atención.',
    priority: 'medium',
    generatedAt: new Date().toISOString(),
    icon: '💡'
  },
  {
    id: 'ins_004',
    type: 'recommendation',
    title: 'Lightning Network: alta tasa de éxito',
    body: 'El 92% de tus pagos Lightning se completan en menos de 3 segundos. Considera migrar más transacciones pequeñas a Lightning para reducir comisiones.',
    priority: 'low',
    generatedAt: new Date().toISOString(),
    icon: '⚡'
  },
  {
    id: 'ins_005',
    type: 'anomaly',
    title: 'BTC: precio en zona de soporte',
    body: 'El precio del BTC bajó 2.3% en las últimas 24 horas. Tus ingresos en USD se verán levemente afectados. Considera mantener reservas en USDT si hay alta volatilidad.',
    priority: 'medium',
    generatedAt: new Date().toISOString(),
    icon: '📉'
  }
];

export const dashboardService = {
  getMetrics: (): Promise<DashboardMetrics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRevenueTodayBTC: '0.01720000',
          totalRevenueTodayUSD: '$1,085.20',
          totalTransactionsToday: 6,
          successfulToday: 4,
          failedToday: 1,
          avgTicketUSD: 180.87,
          activeAlerts: 2,
          btcPriceUSD: 63012.50,
          btcChange24h: -2.31
        });
      }, 500);
    });
  },

  getDailySummary: (): Promise<DailySummary> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          date: new Date().toISOString(),
          totalRevenueBTC: '0.01720000',
          totalRevenueUSD: '$1,085.20',
          totalTransactions: 6,
          successRate: 83.3,
          avgTicketUSD: 180.87,
          topStore: 'Café Central',
          insights: aiInsights
        });
      }, 800);
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
    const responses = [
      'Basado en tu historial, Café Central es tu sucursal más productiva. Te recomiendo evaluar abrir un punto adicional en la zona norte de Quito.',
      'Tus transacciones Lightning Network tienen una tasa de éxito del 92.3%, muy por encima del promedio de la red (87%). Excelente configuración de liquidez.',
      'El ticket promedio de hoy es $180.87 USD. Si mantienes este ritmo, podrías superar tu record mensual actual de $28,400 USD.',
      'He detectado 2 alertas KYT pendientes. Te recomiendo resolverlas antes del cierre de semana para mantener buen standing con los auditores.',
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    });
  }
};
