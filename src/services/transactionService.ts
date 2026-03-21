// import api from './api';
import { type Transaction } from '../types';
import { mockTransactions } from '../data/mockTransactions';

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    // PREPARED FOR BACKEND: const response = await api.get<Transaction[]>('/transactions');
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTransactions as Transaction[]), 400);
    });
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    // PREPARED FOR BACKEND: const response = await api.get<Transaction>(`/transactions/${id}`);
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve((mockTransactions as Transaction[]).find(t => t.id === id)), 200);
    });
  },

  getByStore: async (store: string): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve((mockTransactions as Transaction[]).filter(t => t.store === store)), 300);
    });
  }
};
