import type { CardDto } from '../types/dtos/card';

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

export type UICardItem  = {
  id: string;
  player: UIPlayer;
  status: string;
};

export const mapPosition = (pos: string): "GK" | "DEF" | "MID" | "FWD" => {
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

export const mapRarity = (type: string): "Common" | "Rare" | "Epic" | "Legendary" => {
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
