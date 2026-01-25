import { useState, useEffect } from 'react';
import TransactionService from '../services/TransactionService';
import { mapDtosToTransactions } from '../utils/transactionMapper';
import type { Transaction } from '../types/types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const dtos = await TransactionService.getMyTransactions();
        setTransactions(mapDtosToTransactions(dtos));
      } catch (err) {
        console.error('Failed to load transactions', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { transactions, loading };
};
