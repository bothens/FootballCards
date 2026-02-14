import type { MarketCardDto } from '../types/dtos/market';
import type { UICardItem } from './cardMapper';
import { mapPosition, mapRarity } from './cardMapper';

export const mapMarketCardDtoToUIMarketItem = (cards: MarketCardDto[]): UICardItem[] => {
  return cards.map(c => ({
    id: String(c.cardId),
    player: {
      id: String(c.playerId),
      identityId: '',
      name: c.playerName,
      team: c.playerTeam || 'Unknown Team',
      position: mapPosition(c.playerPosition),
      price: c.sellingPrice,
      image: c.cardImageUrl || c.playerImageUrl,
      rarity: mapRarity(c.cardType),
    },
    status: c.status,
    highestBid: c.highestBid ?? null,
  }));
};
