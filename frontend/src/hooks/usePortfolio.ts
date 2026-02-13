import { useState, useEffect } from 'react';
import PortfolioService from '../services/PortfolioService';
import MarketService from '../services/MarketService';
import type { CardDto } from '../types/dtos/card';
import { mapCardDtoToUIPortfolioItem  } from '../utils/portfolioMapper';

export const usePortfolio = () => {
  const [items, setItems] = useState(mapCardDtoToUIPortfolioItem([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setError(null);
        const response: CardDto[] = await PortfolioService.getMyPortfolio();
        setItems(mapCardDtoToUIPortfolioItem(response));
      } catch (err) {
        console.error('Failed to load portfolio', err);
        const message = err instanceof Error ? err.message : 'Failed to load portfolio';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);


  const sellItem = async (itemId: string, sellingPrice: number) => {
    try {
      await MarketService.sellCard({ cardId: Number(itemId), sellingPrice });
      const updated: CardDto[] = await PortfolioService.getMyPortfolio();
      setItems(mapCardDtoToUIPortfolioItem(updated));
    } catch (error) {
      console.error('Failed to sell card', error);
      throw error;
    }
  };

  return { items, loading, error, sellItem };
};
