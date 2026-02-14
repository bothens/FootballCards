import type { CardDto } from '../types/dtos/card';
import type { UICardItem } from './cardMapper'; // UIPlayer kan återanvändas
import { mapPosition, mapRarity } from './cardMapper';

export const mapCardDtoToUIPortfolioItem = (cards: CardDto[]): UICardItem[] => {
  return cards.map(c => ({
    id: String(c.cardId),
    player: {
      id: String(c.playerId),
      identityId: '', // kan sättas om du har identityId i backend
      name: c.playerName,
      team: c.playerTeam || 'Unknown Team',
      position: mapPosition(c.playerPosition),
      price: c.price,
      image: c.cardImageUrl || c.playerImageUrl,
      rarity: mapRarity(c.cardType),
      facts: c.facts || undefined,
      factsEn: c.factsEn || undefined,
    },
    status: c.status,
  }));
};
