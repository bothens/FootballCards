
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
interface UserData {
  user: User;
  portfolio: PortfolioItem[];
  transactions: Transaction[];
}
const USERS_STORAGE: Record<string, UserData> = {};

// Globala tillstånd för marknaden (delas av alla)
let playerDb: PlayerIdentity[] = [...INITIAL_IDENTITIES];
let availablePlayers: Player[] = [...INITIAL_CARDS];

// Aktiva sessionens tillstånd (rensas vid logout)
let currentUser: User | null = null;
let userPortfolio: PortfolioItem[] = [];
let transactions: Transaction[] = [];

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
      if (currentUser) {
        USERS_STORAGE[currentUser.id] = {
          user: { ...currentUser },
          portfolio: [...userPortfolio],
          transactions: [...transactions]
        };
      }

      // Nolla den aktiva sessionen
      currentUser = null;
      userPortfolio = [];
      transactions = [];
      
      // Notera: availablePlayers och playerDb nollas INTE eftersom de är globala för marknaden.
      resolve();
    }, 300);
  });
};

// Hjälpfunktion för att synka session-data till lagret
const syncToStorage = () => {
  if (currentUser) {
    USERS_STORAGE[currentUser.id] = {
      user: { ...currentUser },
      portfolio: [...userPortfolio],
      transactions: [...transactions]
    };
  }
};

export const updateProfile = (data: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) return reject('Ej inloggad');
      currentUser = { ...currentUser, ...data };
      syncToStorage();
      resolve(currentUser);
    }, 800);
  });
};

export const changePassword = (current: string, next: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (next.length < 6) return reject('Det nya lösenordet måste vara minst 6 tecken långt.');
      resolve();
    }, 1000);
  });
};

export const getPlayerDb = (): Promise<(PlayerIdentity & { supply: number })[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = playerDb.map(p => {
        const inMarket = availablePlayers.filter(c => c.identityId === p.id).length;
        const inPortfolios = Object.values(USERS_STORAGE).reduce((acc, u) => 
          acc + u.portfolio.filter(item => item.player.identityId === p.id).length, 0);
        return { ...p, supply: inMarket + inPortfolios };
      });
      resolve(data);
    }, 400);
  });
};

export const createPlayerIdentity = (data: Omit<PlayerIdentity, 'id'>): Promise<PlayerIdentity> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role !== 'admin') return reject('Endast administratörer kan skapa spelare');
      const newIdentity: PlayerIdentity = {
        ...data,
        id: Math.random().toString(36).substr(2, 9)
      };
      playerDb.push(newIdentity);
      resolve(newIdentity);
    }, 600);
  });
};

export const issueCard = (identityId: string, price: number, rarity: Player['rarity']): Promise<Player> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser?.role !== 'admin') return reject('Endast administratörer kan skapa kort');
      const identity = playerDb.find(p => p.id === identityId);
      if (!identity) return reject('Spelaren hittades inte i databasen. Skapa spelaren först.');

      const newCard: Player = {
        id: Math.random().toString(36).substr(2, 9),
        identityId: identity.id,
        name: identity.name,
        team: identity.team,
        position: identity.position,
        image: identity.image,
        price,
        rarity
      };
      availablePlayers.push(newCard);
      resolve(newCard);
    }, 600);
  });
};

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
        id: Math.random().toString(36).substr(2, 9),
        playerId,
        player,
        purchasePrice: player.price,
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
      
      syncToStorage();
      resolve({ success: true, itemId, newBalance: currentUser.balance });
    }, 500);
  });
};
