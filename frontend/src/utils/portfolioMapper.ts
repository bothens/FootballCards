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
      team: 'Unknown Team', // kan uppdateras om backend skickar team
      position: mapPosition(c.playerPosition),
      price: c.price,
      image: c.playerImageUrl,
      rarity: mapRarity(c.cardType),
    },
    status: c.status,
  }));
};
