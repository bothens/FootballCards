
import React, { useState, useMemo } from 'react';
import { useMarket } from '../hooks/useMarket';
import { CardItem } from '../components/Card/CardItem';
import { useAuth } from '../hooks/useAuth';
import { SearchInput } from '../components/Common/SearchInput';

export const Market: React.FC = () => {
  const { players, loading, purchasePlayer, refresh } = useMarket();
  const { user } = useAuth();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return players.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  const handleBuy = async (playerId: string) => {
    if (user?.role === 'admin') {
      alert('Administratörer kan inte delta i handeln');
      return;
    }
    setBuyingId(playerId);
    const success = await purchasePlayer(playerId);
    if (success) {
      await refresh();
    }
    setBuyingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 animate-pulse font-medium uppercase tracking-widest text-xs">Scanning World Markets...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">Transfer Market</h2>
          <p className="text-zinc-500 text-sm">Add the world's best talent to your elite portfolio. Unique assets only.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <SearchInput 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Sök spelare eller lag..." 
            className="w-full sm:w-64"
          />
          <div className="flex space-x-2">
             <button className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-colors">Filters</button>
             <button className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-colors">Sort: Pris</button>
          </div>
        </div>
      </header>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
           <p className="text-zinc-500 uppercase text-xs font-black tracking-widest mb-2">
             {searchTerm ? 'Inga träffar' : 'Market Sold Out'}
           </p>
           <p className="text-zinc-600">
             {searchTerm ? `Hittade inga spelare som matchade "${searchTerm}"` : 'No players currently available for acquisition.'}
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <CardItem 
              key={player.id} 
              player={player} 
              actionLabel={isAdmin ? "Admin Vy" : "Köp"} 
              onAction={() => handleBuy(player.id)}
              isProcessing={buyingId === player.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
