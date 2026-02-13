// Define UI player to match CardItem player type
export type UIPlayer = {
  id: string;
  identityId: string;
  name: string;
  team: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  price: number;
  image: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Skiller" | "Historical Moment";
};

export type UICardItem  = {
  id: string;
  player: UIPlayer;
  status: string;
  highestBid?: number | null;
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

export const mapRarity = (type: string): "Common" | "Rare" | "Epic" | "Legendary" | "Skiller" | "Historical Moment" => {
  switch (type.toLowerCase()) {
    case "common":
      return "Common";
    case "rare":
      return "Rare";
    case "epic":
      return "Epic";
    case "legendary":
      return "Legendary";
    case "skiller":
      return "Skiller";
    case "historical moment":
    case "historical_moment":
      return "Historical Moment";
    default:
      return "Common"; // fallback
  }
};

