import { useState, useEffect } from 'react';
import PortfolioService from '../services/PortfolioService';
import MarketService from '../services/MarketService';
import type { CardDto } from '../types/card';
import { mapCardDtoToUIPortfolioItem, type UIPortfolioItem } from '../utils/cardMapper';

export const usePortfolio = () => {
  const [items, setItems] = useState<UIPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response: CardDto[] = await PortfolioService.getMyPortfolio();
        console.log("API response:", response);
        setItems(mapCardDtoToUIPortfolioItem(response));
      } catch (err) {
        console.error('Failed to load portfolio', err);
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

  return { items, loading, sellItem };
};
