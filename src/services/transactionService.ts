import { mockTransactions } from '../data/mockTransactions';
import { type Transaction } from '../types';

export const transactionService = {
  getAll: (): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTransactions), 600);
    });
  },

  getById: (id: string): Promise<Transaction | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTransactions.find(t => t.id === id)), 300);
    });
  },

  getByStore: (store: string): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTransactions.filter(t => t.store === store)), 400);
    });
  },

  getByStatus: (status: Transaction['status']): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTransactions.filter(t => t.status === status)), 400);
    });
  }
};
