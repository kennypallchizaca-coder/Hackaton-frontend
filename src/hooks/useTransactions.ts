import { useState, useEffect, useCallback } from 'react';
import { type Transaction } from '../types';
import { transactionService } from '../services/transactionService';

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await transactionService.getAll();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { data, isLoading, error, refetch: fetchTransactions };
}
