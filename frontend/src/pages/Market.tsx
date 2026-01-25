
import React, { useState, useMemo } from 'react';
import { useMarketCards } from '../hooks/useMarket';
import { CardItem } from '../components/Card/CardItem';
import { useAuth } from '../hooks/useAuth';
import MarketService from '../services/MarketService';
import { CardSortAndFilter } from '../components/Card/CardSortAndFilter';

export const Market: React.FC = () => {
  const { cards, loading, error, refresh, setParams } = useMarketCards();
  const { user } = useAuth();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      card.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

const handleBuy = async (cardId: number) => {
  if (!user) {
    alert("Du måste vara inloggad för att köpa kort.");
    return;
  }

  if (user.role === "admin") {
    alert("Administratörer kan inte delta i handeln.");
    return;
  }

  setBuyingId(cardId.toString());

  try {
    const purchasedCard = await MarketService.purchaseCard({ cardId });

    if (!purchasedCard || purchasedCard.status !== "Sold") {
      alert("Köpet lyckades inte. Kortet är kanske redan sålt.");
    } else {
      alert(`Du köpte ${purchasedCard.playerName} för ${purchasedCard.sellingPrice ?? purchasedCard.sellingPrice } €`);
    }

    await refresh();
  } catch (err: any) {
    console.error("Purchase failed:", err);
    alert(err?.message || "Köpet misslyckades, försök igen senare.");
  } finally {
    setBuyingId(null);
  }
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
        
          <CardSortAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={(filter) => setParams({ filter })}
            onSortChange={(sort) => setParams({ sort })}
          />
      </header>

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {filteredCards.length === 0 ? (
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
          {filteredCards.map((card) => (
            <CardItem 
              key={card.id}
              player={card.player}
              actionLabel={isAdmin ? "Admin Vy" : "Köp"} 
              onAction={() => handleBuy(Number(card.id))}
              isProcessing={buyingId === card.id.toString()}
            />
          ))}
        </div>
      )}
    </div>
  );
};
