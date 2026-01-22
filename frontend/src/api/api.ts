<<<<<<< HEAD
import type {
  Player,
  User,
  PortfolioItem,
  Transaction,
  PlayerIdentity,
} from "../types/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5025";

type BackendAuthResponse = {
  userId: string;
  email: string;
  displayName: string;
  token: string;
};

=======

import type { Player, User, PortfolioItem, Transaction, LeaderboardEntry, PlayerIdentity } from '../types/types';

const INITIAL_IDENTITIES: PlayerIdentity[] = [
  { id: 'p1', name: 'Kylian Mbappé', team: 'Real Madrid', position: 'FWD', image: 'https://picsum.photos/seed/mbappe/300/400' },
  { id: 'p2', name: 'Erling Haaland', team: 'Manchester City', position: 'FWD', image: 'https://picsum.photos/seed/haaland/300/400' },
  { id: 'p3', name: 'Kevin De Bruyne', team: 'Manchester City', position: 'MID', image: 'https://picsum.photos/seed/kdb/300/400' },
  { id: 'p4', name: 'Virgil van Dijk', team: 'Liverpool', position: 'DEF', image: 'https://picsum.photos/seed/vvd/300/400' },
  { id: 'p5', name: 'Alisson Becker', team: 'Liverpool', position: 'GK', image: 'https://picsum.photos/seed/alisson/300/400' },
];

const INITIAL_CARDS: Player[] = [
  {
    id: 'c1',
    identityId: 'p4',
    name: 'Virgil van Dijk',
    team: 'Liverpool',
    position: 'DEF',
    price: 600000,
    rarity: 'Epic',
    image: 'https://picsum.photos/seed/vvd/300/400'
  },
  {
    id: 'c2',
    identityId: 'p5',
    name: 'Alisson Becker',
    team: 'Liverpool',
    position: 'GK',
    price: 450000,
    rarity: 'Rare',
    image: 'https://picsum.photos/seed/alisson/300/400'
  }
];

// --- PERSISTENT MOCK STORAGE ---
// Denna lagrar data för olika användare så att de inte försvinner vid utloggning.
>>>>>>> main
interface UserData {
  user: User;
  portfolio: PortfolioItem[];
  transactions: Transaction[];
}
<<<<<<< HEAD

type MockState = {
  usersStorage: Record<string, UserData>;
  playerDb: PlayerIdentity[];
  availablePlayers: Player[];
};

const MOCK_STATE_KEY = "ft_mock_state";

const INITIAL_IDENTITIES: PlayerIdentity[] = [
  { id: "p1", name: "Kylian Mbappゼ", team: "Real Madrid", position: "FWD", image: "https://cdn.britannica.com/39/239139-050-49A950D1/French-soccer-player-Kylian-Mbappe-FIFA-World-Cup-December-10-2022.jpg" },
  { id: "p2", name: "Erling Haaland", team: "Manchester City", position: "FWD", image: "https://media.gettyimages.com/id/2168220190/photo/manchester-england-erling-haaland-of-manchester-city-celebrates-after-scoring-his-sides-first.jpg?s=612x612&w=gi&k=20&c=vRtyEzGixf7FvYHWi3Xw3jK1h26tCnr5izVh0ux9gac=" },
  { id: "p3", name: "Kevin De Bruyne", team: "Manchester City", position: "MID", image: "https://www.shutterstock.com/image-photo/milan-italy-february-16-2022-260nw-2127570458.jpg" },
  { id: "p4", name: "Virgil van Dijk", team: "Liverpool", position: "DEF", image: "https://st5.depositphotos.com/43708092/63305/i/450/depositphotos_633055802-stock-photo-virgil-van-dijk-liverpool-reacts.jpg" },
  { id: "p5", name: "Alisson Becker", team: "Liverpool", position: "GK", image: "https://st2.depositphotos.com/36221892/85918/i/450/depositphotos_859189746-stock-photo-alisson-becker-liverpool-looks-uefa.jpg" },
];

const INITIAL_CARDS: Player[] = [
  {
    id: "c1",
    identityId: "p4",
    name: "Virgil van Dijk",
    team: "Liverpool",
    position: "DEF",
    price: 600000,
    rarity: "Epic",
    image: "https://st5.depositphotos.com/43708092/63305/i/450/depositphotos_633055802-stock-photo-virgil-van-dijk-liverpool-reacts.jpg"
  },
  {
    id: "c2",
    identityId: "p5",
    name: "Alisson Becker",
    team: "Liverpool",
    position: "GK",
    price: 450000,
    rarity: "Rare",
    image: "https://st2.depositphotos.com/36221892/85918/i/450/depositphotos_859189746-stock-photo-alisson-becker-liverpool-looks-uefa.jpg"
  }
];

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (data as any)?.detail ||
      (data as any)?.message ||
      JSON.stringify(data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

function loadMockState(): MockState | null {
  const raw = localStorage.getItem(MOCK_STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MockState;
    if (!parsed || !parsed.usersStorage || !parsed.playerDb || !parsed.availablePlayers) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveMockState(state: MockState) {
  localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(state));
}

function mapBackendUserToFrontend(u: BackendAuthResponse): User {
  const role = u.email.toLowerCase() === "admin@test.se" ? "admin" : "user";
  return {
    id: u.userId,
    username: u.displayName,
    email: u.email,
    balance: 2000000,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.userId}`,
    rank: 124,
    joinDate: new Date().toISOString(),
    role,
  };
}

let USERS_STORAGE: Record<string, UserData> = {};
let playerDb: PlayerIdentity[] = [...INITIAL_IDENTITIES];
let availablePlayers: Player[] = [...INITIAL_CARDS];

const storedState = loadMockState();
if (storedState) {
  USERS_STORAGE = storedState.usersStorage ?? {};
  playerDb = storedState.playerDb ?? playerDb;
  availablePlayers = storedState.availablePlayers ?? availablePlayers;
}

=======
const USERS_STORAGE: Record<string, UserData> = {};

// Globala tillstånd för marknaden (delas av alla)
let playerDb: PlayerIdentity[] = [...INITIAL_IDENTITIES];
let availablePlayers: Player[] = [...INITIAL_CARDS];

// Aktiva sessionens tillstånd (rensas vid logout)
>>>>>>> main
let currentUser: User | null = null;
let userPortfolio: PortfolioItem[] = [];
let transactions: Transaction[] = [];

<<<<<<< HEAD
export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const res = await postJson<BackendAuthResponse>(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });

  const user = mapBackendUserToFrontend(res);

  currentUser = user;

  USERS_STORAGE[user.id] = USERS_STORAGE[user.id] ?? {
    user,
    portfolio: [],
    transactions: [],
  };

  userPortfolio = [...USERS_STORAGE[user.id].portfolio];
  transactions = [...USERS_STORAGE[user.id].transactions];

  saveMockState({ usersStorage: USERS_STORAGE, playerDb, availablePlayers });

  return { user, token: res.token };
};

export const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ user: User; token: string }> => {
  const res = await postJson<BackendAuthResponse>(`${API_BASE}/api/auth/register`, {
    email,
    password,
    displayName,
  });

  const user = mapBackendUserToFrontend(res);

  currentUser = user;

  USERS_STORAGE[user.id] = USERS_STORAGE[user.id] ?? {
    user,
    portfolio: [],
    transactions: [],
  };

  userPortfolio = [...USERS_STORAGE[user.id].portfolio];
  transactions = [...USERS_STORAGE[user.id].transactions];

  saveMockState({ usersStorage: USERS_STORAGE, playerDb, availablePlayers });

  return { user, token: res.token };
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
=======
export const login = (identifier: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Skapa ett unikt ID baserat på input (t.ex. "admin" eller "user")
      const userId = identifier.toLowerCase();
      
      // Kolla om användaren redan finns i vårt lager
      if (USERS_STORAGE[userId]) {
        const storedData = USERS_STORAGE[userId];
        currentUser = { ...storedData.user };
        userPortfolio = [...storedData.portfolio];
        transactions = [...storedData.transactions];
        
        resolve({ user: currentUser, token: `mock-jwt-${userId}` });
        return;
      }

      // Om ny användare, initiera standardvärden
      const isRoleAdmin = userId === 'admin';
      const isRoleUser = userId === 'user';
      
      let finalRole: 'user' | 'admin' = isRoleAdmin ? 'admin' : 'user';
      let username = isRoleAdmin ? 'Head Scout (Admin)' : (isRoleUser ? 'Elite Trader' : identifier.split('@')[0]);
      let email = isRoleAdmin ? 'admin@footytrade.com' : (identifier.includes('@') ? identifier : `${identifier}@footytrade.com`);

      const newUser: User = {
        id: userId,
        username: username,
        email: email,
        balance: isRoleAdmin ? 50000000 : 2000000,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        rank: isRoleAdmin ? 1 : 124,
        joinDate: new Date().toISOString(),
        role: finalRole
      };

      // Spara i lager för framtida inloggningar
      USERS_STORAGE[userId] = {
        user: newUser,
        portfolio: [],
        transactions: []
      };

      currentUser = newUser;
      userPortfolio = [];
      transactions = [];

      resolve({ user: newUser, token: `mock-jwt-${userId}` });
    }, 800);
  });
};

/**
 * Logout rensar bara den aktiva sessionen (variablerna för nuvarande vy).
 * All data finns kvar i USERS_STORAGE och återställs vid nästa login.
 */
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Spara nuvarande session till lagret innan vi nollar (ifall ändringar gjorts)
>>>>>>> main
      if (currentUser) {
        USERS_STORAGE[currentUser.id] = {
          user: { ...currentUser },
          portfolio: [...userPortfolio],
<<<<<<< HEAD
          transactions: [...transactions],
        };
      }
      currentUser = null;
      userPortfolio = [];
      transactions = [];
      saveMockState({ usersStorage: USERS_STORAGE, playerDb, availablePlayers });
=======
          transactions: [...transactions]
        };
      }

      // Nolla den aktiva sessionen
      currentUser = null;
      userPortfolio = [];
      transactions = [];
      
      // Notera: availablePlayers och playerDb nollas INTE eftersom de är globala för marknaden.
>>>>>>> main
      resolve();
    }, 300);
  });
};

<<<<<<< HEAD
=======
// Hjälpfunktion för att synka session-data till lagret
>>>>>>> main
const syncToStorage = () => {
  if (currentUser) {
    USERS_STORAGE[currentUser.id] = {
      user: { ...currentUser },
      portfolio: [...userPortfolio],
<<<<<<< HEAD
      transactions: [...transactions],
    };
    saveMockState({ usersStorage: USERS_STORAGE, playerDb, availablePlayers });
=======
      transactions: [...transactions]
    };
>>>>>>> main
  }
};

export const updateProfile = (data: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
<<<<<<< HEAD
      if (!currentUser) return reject("Ej inloggad");
=======
      if (!currentUser) return reject('Ej inloggad');
>>>>>>> main
      currentUser = { ...currentUser, ...data };
      syncToStorage();
      resolve(currentUser);
    }, 800);
  });
};

export const changePassword = (current: string, next: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
<<<<<<< HEAD
      if (next.length < 6) return reject("Det nya lБsenordet mヂste vara minst 6 tecken lヂngt.");
=======
      if (next.length < 6) return reject('Det nya lösenordet måste vara minst 6 tecken långt.');
>>>>>>> main
      resolve();
    }, 1000);
  });
};

export const getPlayerDb = (): Promise<(PlayerIdentity & { supply: number })[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
<<<<<<< HEAD
      const data = playerDb.map((p) => {
        const inMarket = availablePlayers.filter((c) => c.identityId === p.id).length;
        const inPortfolios = Object.values(USERS_STORAGE).reduce(
          (acc, u) => acc + u.portfolio.filter((item) => item.player.identityId === p.id).length,
          0
        );
=======
      const data = playerDb.map(p => {
        const inMarket = availablePlayers.filter(c => c.identityId === p.id).length;
        const inPortfolios = Object.values(USERS_STORAGE).reduce((acc, u) => 
          acc + u.portfolio.filter(item => item.player.identityId === p.id).length, 0);
>>>>>>> main
        return { ...p, supply: inMarket + inPortfolios };
      });
      resolve(data);
    }, 400);
  });
};

<<<<<<< HEAD
export const createPlayerIdentity = (
  data: Omit<PlayerIdentity, "id">
): Promise<PlayerIdentity> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role !== "admin") return reject("Endast administratБrer kan skapa spelare");
      const newIdentity: PlayerIdentity = { ...data, id: Math.random().toString(36).substr(2, 9) };
      playerDb.push(newIdentity);
      saveMockState({ usersStorage: USERS_STORAGE, playerDb, availablePlayers });
=======
export const createPlayerIdentity = (data: Omit<PlayerIdentity, 'id'>): Promise<PlayerIdentity> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role !== 'admin') return reject('Endast administratörer kan skapa spelare');
      const newIdentity: PlayerIdentity = {
        ...data,
        id: Math.random().toString(36).substr(2, 9)
      };
      playerDb.push(newIdentity);
>>>>>>> main
      resolve(newIdentity);
    }, 600);
  });
};

<<<<<<< HEAD
export const issueCard = (
  identityId: string,
  price: number,
  rarity: Player["rarity"]
): Promise<Player> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role !== "admin") return reject("Endast administratБrer kan skapa kort");
      const identity = playerDb.find((p) => p.id === identityId);
      if (!identity) return reject("Spelaren hittades inte");
=======
export const issueCard = (identityId: string, price: number, rarity: Player['rarity']): Promise<Player> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role !== 'admin') return reject('Endast administratörer kan skapa kort');
      const identity = playerDb.find(p => p.id === identityId);
      if (!identity) return reject('Spelaren hittades inte i databasen. Skapa spelaren först.');

>>>>>>> main
      const newCard: Player = {
        id: Math.random().toString(36).substr(2, 9),
        identityId: identity.id,
        name: identity.name,
        team: identity.team,
        position: identity.position,
        image: identity.image,
        price,
<<<<<<< HEAD
        rarity,
      };
      availablePlayers.push(newCard);
      saveMockState({ usersStorage: USERS_STORAGE, playerDb, availablePlayers });
=======
        rarity
      };
      availablePlayers.push(newCard);
>>>>>>> main
      resolve(newCard);
    }, 600);
  });
};

<<<<<<< HEAD
export const getPlayers = (): Promise<Player[]> =>
  new Promise((resolve) => setTimeout(() => resolve([...availablePlayers]), 600));

export const getPortfolio = (): Promise<PortfolioItem[]> =>
  new Promise((resolve) => setTimeout(() => resolve([...userPortfolio]), 500));

export const getTransactions = (): Promise<Transaction[]> =>
  new Promise((resolve) => setTimeout(() => resolve([...transactions].reverse()), 500));

export const buyCard = (
  playerId: string
): Promise<{ success: boolean; item: PortfolioItem; newBalance: number }> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role === "admin") return reject("AdministratБrer kan inte kБpa kort");
      const index = availablePlayers.findIndex((p) => p.id === playerId);
      if (index === -1 || !currentUser) return reject("Spelaren ビr inte tillgビnglig");
      const player = availablePlayers[index];
      if (currentUser.balance < player.price) return reject("Otillrビckligt saldo");
      currentUser.balance -= player.price;
      availablePlayers.splice(index, 1);
      const item: PortfolioItem = {
=======
export const getPlayers = (): Promise<Player[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...availablePlayers]), 600);
  });
};

export const getPortfolio = (): Promise<PortfolioItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...userPortfolio]), 500);
  });
};

export const getTransactions = (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...transactions].reverse()), 500);
  });
};

export const buyCard = (playerId: string): Promise<{ success: boolean; item: PortfolioItem; newBalance: number }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role === 'admin') return reject('Administratörer kan inte köpa kort');
      
      const playerIndex = availablePlayers.findIndex(p => p.id === playerId);
      if (playerIndex === -1 || !currentUser) return reject('Spelaren är inte längre tillgänglig');
      
      const player = availablePlayers[playerIndex];
      if (currentUser.balance < player.price) return reject('Otillräckligt saldo');

      currentUser.balance -= player.price;
      availablePlayers.splice(playerIndex, 1);

      const newItem: PortfolioItem = {
>>>>>>> main
        id: Math.random().toString(36).substr(2, 9),
        playerId,
        player,
        purchasePrice: player.price,
<<<<<<< HEAD
        acquiredAt: new Date().toISOString(),
      };
      userPortfolio.push(item);
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "BUY",
        playerName: player.name,
        amount: player.price,
        timestamp: new Date().toISOString(),
      });
      syncToStorage();
      resolve({ success: true, item, newBalance: currentUser.balance });
    }, 700);
  });

export const sellCard = (
  itemId: string
): Promise<{ success: boolean; itemId: string; newBalance: number }> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = userPortfolio.findIndex((i) => i.id === itemId);
      if (index === -1 || !currentUser) return reject("Kortet hittades inte");
      const item = userPortfolio[index];
      const sellPrice = Math.floor(item.player.price * 0.9);
      currentUser.balance += sellPrice;
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "SELL",
        playerName: item.player.name,
        amount: sellPrice,
        timestamp: new Date().toISOString(),
      });
      userPortfolio.splice(index, 1);
      availablePlayers.push(item.player);
=======
        acquiredAt: new Date().toISOString()
      };
      
      userPortfolio.push(newItem);
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'BUY',
        playerName: player.name,
        amount: player.price,
        timestamp: new Date().toISOString()
      });

      syncToStorage();
      resolve({ success: true, item: newItem, newBalance: currentUser.balance });
    }, 700);
  });
};

export const sellCard = (itemId: string): Promise<{ success: boolean; itemId: string; newBalance: number }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const itemIndex = userPortfolio.findIndex(i => i.id === itemId);
      if (itemIndex === -1 || !currentUser) return reject('Kortet hittades inte');
      
      const item = userPortfolio[itemIndex];
      const sellPrice = Math.floor(item.player.price * 0.9);
      currentUser.balance += sellPrice;
      
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'SELL',
        playerName: item.player.name,
        amount: sellPrice,
        timestamp: new Date().toISOString()
      });

      userPortfolio.splice(itemIndex, 1);
      availablePlayers.push(item.player);
      
>>>>>>> main
      syncToStorage();
      resolve({ success: true, itemId, newBalance: currentUser.balance });
    }, 500);
  });
<<<<<<< HEAD
=======
};
>>>>>>> main
