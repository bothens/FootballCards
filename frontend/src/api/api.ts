import type {
  Player,
  User,
  PortfolioItem,
  Transaction,
  PlayerIdentity,
} from "../types/ui/types";
import { API_BASE, apiFetch } from "./apiClient";
import PlayerService from "../services/PlayerService";
import CardService from "../services/CardService";
import MarketService from "../services/MarketService";
import PortfolioService from "../services/PortfolioService";
import TransactionService from "../services/TransactionService";
import { mapPosition, mapRarity } from "../utils/cardMapper";
import { mapDtosToTransactions } from "../utils/transactionMapper";
import type { UserProfile } from "./authService";

type BackendAuthResponse = {
  userId: string;
  email: string;
  displayName: string;
  token: string;
  userRole: string;
  balance: number;
  imageUrl?: string;
};

type BackendProfileResponse = {
  userId: number | string;
  email: string;
  displayName: string;
  userRole: string;
  balance: number;
  imageUrl?: string;
};

const DEFAULT_BALANCE = 0;
const getDefaultAvatar = (userId: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

const mapBackendUserToFrontend = (u: BackendAuthResponse): User => {
  const role = u.userRole === "admin" ? "admin" : "user";
  return {
    id: u.userId,
    username: u.displayName,
    email: u.email,
    balance: Number.isFinite(u.balance) ? u.balance : DEFAULT_BALANCE,
    avatar: u.imageUrl || getDefaultAvatar(u.userId),
    rank: 124,
    joinDate: new Date().toISOString(),
    role,
  };
};

const getStoredUser = (): User | null => {
  const raw = localStorage.getItem("ft_user");
  return raw ? (JSON.parse(raw) as User) : null;
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  return apiFetch<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function putJson<T>(url: string, body: unknown): Promise<T> {
  return apiFetch<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const res = await postJson<BackendAuthResponse>(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });

  const user = mapBackendUserToFrontend(res);
  return { user, token: res.token };
};

export const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ user: User; token: string }> => {
  const res = await postJson<BackendAuthResponse>(
    `${API_BASE}/api/auth/register`,
    {
      email,
      password,
      displayName,
    }
  );

  const user = mapBackendUserToFrontend(res);
  return { user, token: res.token };
};

export const logout = async (): Promise<void> => {
  return Promise.resolve();
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const current = getStoredUser();
  if (!current) {
    throw new Error("No user in storage");
  }
  const payload = {
    displayName: data.username ?? current.username,
    imageUrl: data.avatar,
  };
  const updated = await putJson<BackendProfileResponse>(`${API_BASE}/api/users/me`, payload);
  const userId = String(updated.userId ?? current.id);
  return {
    ...current,
    id: userId,
    email: updated.email || current.email,
    username: updated.displayName || current.username,
    role: updated.userRole === "admin" ? "admin" : current.role,
    balance: Number.isFinite(updated.balance) ? updated.balance : current.balance,
    avatar: updated.imageUrl || data.avatar || current.avatar || getDefaultAvatar(userId),
  };
};

export const changePassword = async (current: string, next: string): Promise<void> => {
  await putJson<string>(`${API_BASE}/api/users/me/password`, {
    oldPassword: current,
    newPassword: next,
  });
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  const url = `${API_BASE}/api/users/search?query=${encodeURIComponent(query)}`;
  return apiFetch<UserProfile[]>(url);
};

export const getPlayerDb = async (): Promise<(PlayerIdentity & { supply: number })[]> => {
  const [players, marketCards] = await Promise.all([
    PlayerService.getAll(),
    MarketService.getMarketCards({}),
  ]);

  const supplyByPlayerId = new Map<number, number>();
  for (const card of marketCards) {
    supplyByPlayerId.set(
      card.playerId,
      (supplyByPlayerId.get(card.playerId) ?? 0) + 1
    );
  }

  return players.map((p) => ({
    id: String(p.id),
    name: p.name,
    team: p.team || "Unknown Team",
    position: mapPosition(p.position),
    image: p.imageUrl || `https://picsum.photos/seed/player-${p.id}/300/400`,
    supply: supplyByPlayerId.get(p.id) ?? 0,
  }));
};

export const createPlayerIdentity = async (
  data: Omit<PlayerIdentity, "id">
): Promise<PlayerIdentity> => {
  const created = await PlayerService.create({
    name: data.name,
    position: data.position,
    imageUrl: data.image,
    team: data.team,
  });

  return {
    id: String(created.id),
    name: created.name,
    team: created.team || data.team || "Unknown Team",
    position: mapPosition(created.position),
    image: data.image || created.imageUrl || `https://picsum.photos/seed/player-${created.id}/300/400`,
  };
};

export const issueCard = async (
  identityId: string,
  price: number,
  rarity: Player["rarity"]
): Promise<Player> => {
  const created = await CardService.issueCard({
    playerId: Number(identityId),
    price,
    cardType: rarity,
  });

  return {
    id: String(created.cardId),
    identityId: String(created.playerId),
    name: created.playerName,
    team: "Unknown Team",
    position: mapPosition(created.playerPosition),
    price: created.price,
    image: created.cardImageUrl || created.playerImageUrl || "",
    rarity: mapRarity(created.cardType),
  };
};

export const getPlayers = async (): Promise<Player[]> => {
  const cards = await MarketService.getMarketCards({});
  return cards.map((c) => ({
    id: String(c.cardId),
    identityId: String(c.playerId),
    name: c.playerName,
    team: c.playerTeam || "Unknown Team",
    position: mapPosition(c.playerPosition),
    price: c.sellingPrice,
    image: c.cardImageUrl || c.playerImageUrl || "",
    rarity: mapRarity(c.cardType),
  }));
};

export const getPortfolio = async (): Promise<PortfolioItem[]> => {
  const cards = await PortfolioService.getMyPortfolio();
  return cards.map((c) => ({
    id: String(c.cardId),
    playerId: String(c.playerId),
    player: {
      id: String(c.playerId),
      identityId: String(c.playerId),
      name: c.playerName,
      team: c.playerTeam || "Unknown Team",
      position: mapPosition(c.playerPosition),
      price: c.price,
      image: c.cardImageUrl || c.playerImageUrl || "",
      rarity: mapRarity(c.cardType),
    },
    purchasePrice: c.price,
    acquiredAt: new Date().toISOString(),
  }));
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const dtos = await TransactionService.getMyTransactions();
  return mapDtosToTransactions(dtos);
};

export const buyCard = async (
  playerId: string
): Promise<{ success: boolean; item: PortfolioItem; newBalance: number }> => {
  const purchased = await MarketService.purchaseCard({ cardId: Number(playerId) });
  const item: PortfolioItem = {
    id: String(purchased.cardId),
    playerId: String(purchased.playerId),
    player: {
      id: String(purchased.playerId),
      identityId: String(purchased.playerId),
      name: purchased.playerName,
      team: purchased.playerTeam || "Unknown Team",
      position: mapPosition(purchased.playerPosition),
      price: purchased.price,
      image: purchased.cardImageUrl || purchased.playerImageUrl || "",
      rarity: mapRarity(purchased.cardType),
    },
    purchasePrice: purchased.price,
    acquiredAt: new Date().toISOString(),
  };

  const newBalance = getStoredUser()?.balance ?? 0;
  return { success: true, item, newBalance };
};

export const sellCard = async (
  itemId: string,
  sellingPrice?: number
): Promise<{ success: boolean; itemId: string; newBalance: number }> => {
  if (!sellingPrice || sellingPrice <= 0) {
    throw new Error("sellingPrice is required");
  }

  await MarketService.sellCard({ cardId: Number(itemId), sellingPrice });
  const newBalance = getStoredUser()?.balance ?? 0;
  return { success: true, itemId, newBalance };
};
