import { useState, useEffect, useCallback } from 'react';
import type { QueryParams } from '../types/ui/types';
import type { UICardItem } from '../utils/cardMapper';
import MarketService from '../services/MarketService';
import { mapMarketCardDtoToUIMarketItem } from '../utils/marketMapper';

export const useMarketCards = (initialParams?: QueryParams) => {
  const [cards, setCards] = useState<UICardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<QueryParams>(initialParams || {});

  const fetchMarketCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dtos = await MarketService.getMarketCards(params);
      const mapped = mapMarketCardDtoToUIMarketItem(dtos);
      setCards(mapped);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market cards';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMarketCards();
  }, [fetchMarketCards]);

  const updateParams = (newParams: Partial<QueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return {
    cards,
    loading,
    error,
    refresh: fetchMarketCards,
    setParams: updateParams,
  };
};
