// src/utils/cardMapper.ts
import type { CardDto } from '../types/card';

// Definiera UI-spelaren så att den matchar Player-typen i CardItem
export type UIPlayer = {
  id: string;
  identityId: string;
  name: string;
  team: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  price: number;
  image: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
};

// Portfolio item innehåller en spelare
export type UIPortfolioItem = {
  id: string;
  player: UIPlayer;
  status: string;
};

const mapPosition = (pos: string): "GK" | "DEF" | "MID" | "FWD" => {
  switch (pos.toLowerCase()) {
    case "goalkeeper":
    case "gk":
      return "GK";
    case "defender":
    case "def":
      return "DEF";
    case "midfielder":
    case "mid":
      return "MID";
    case "forward":
    case "fwd":
      return "FWD";
    default:
      return "MID"; // fallback
  }
};

const mapRarity = (type: string): "Common" | "Rare" | "Epic" | "Legendary" => {
  switch (type.toLowerCase()) {
    case "common":
      return "Common";
    case "rare":
      return "Rare";
    case "epic":
      return "Epic";
    case "legendary":
      return "Legendary";
    default:
      return "Common"; // fallback
  }
};


// Mappa en lista av CardDto till UIPortfolioItem
export const mapCardDtoToUIPortfolioItem = (cards: CardDto[]): UIPortfolioItem[] => {
  return cards.map(c => ({
    id: String(c.cardId),
    player: {
      id: String(c.playerId),
      identityId: '', // kan sättas om du har identityId i backend
      name: c.playerName,
      team: 'Unknown Team', // kan uppdateras om backend skickar team
      position: mapPosition(c.playerPosition),
      price: c.price,
      image: '',
      rarity: mapRarity(c.cardType),
    },
    status: c.status,
  }));
};
