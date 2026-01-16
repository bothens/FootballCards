
import { useState, useEffect, useCallback } from 'react';
import type { PortfolioItem } from '../types/types';
import * as api from '../api/api';
import { useAuth } from './useAuth';

export const usePortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateBalance } = useAuth();

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPortfolio();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sellItem = async (itemId: string) => {
    try {
      const result = await api.sellCard(itemId);
      if (result.success) {
        setItems(prev => prev.filter(i => i.id !== itemId));
        updateBalance(result.newBalance);
        return true;
      }
      return false;
    } catch (err) {
      alert('Selling failed');
      return false;
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const totalValue = items.reduce((sum, item) => sum + item.player.price, 0);

  return { items, loading, totalValue, sellItem, refresh: fetchPortfolio };
};
