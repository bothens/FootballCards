
export interface PlayerIdentity {
  id: string;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  image: string;
}

export interface Player {
  id: string;
  identityId: string; // Link to PlayerIdentity
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  price: number;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  avatar: string;
  rank: number;
  joinDate: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface PortfolioItem {
  id: string;
  playerId: string;
  player: Player;
  purchasePrice: number;
  acquiredAt: string;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  playerName: string;
  amount: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  username: string;
  avatar: string;
  portfolioValue: number;
  rank: number;
}
