
import { useState, useEffect, useCallback } from 'react';
import type { Player } from '../types/types';
import * as api from '../api/api';
import { useAuth } from './useAuth';

export const useMarket = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateBalance } = useAuth();

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPlayers();
      setPlayers(data);
    } catch (err) {
      setError('Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, []);

  const purchasePlayer = async (playerId: string) => {
    try {
      const result = await api.buyCard(playerId);
      if (result.success) {
        updateBalance(result.newBalance);
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err || 'Purchase failed');
      return false;
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, purchasePlayer, refresh: fetchPlayers };
};
