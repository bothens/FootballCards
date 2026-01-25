
import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { CardItem } from '../components/Card/CardItem';
import { Link } from 'react-router-dom';
import { SearchInput } from '../components/Common/SearchInput';

export const Portfolio: React.FC = () => {
  const { items, loading, sellItem } = usePortfolio();
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleSell = async (itemId: string) => {
    const priceStr = prompt("Ange försäljningspris för kortet:");
    if (!priceStr) return;

    const sellingPrice = parseFloat(priceStr);
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      alert("Ogiltigt pris");
      return;
    }

    if (confirm(`Vill du lista detta kort för ${sellingPrice} €?`)) {
      setSellingId(itemId);
      try {
        await sellItem(itemId, sellingPrice); // använder metoden från hook
      } catch (err) {
        alert("Försäljning misslyckades");
      } finally {
        setSellingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Auditing your assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">Your Squad</h2>
          <p className="text-zinc-500 text-sm">Manage your collection of elite football assets.</p>
        </div>
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Sök i din trupp..." 
          className="w-full sm:w-80"
        />
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <div className="text-zinc-600 mb-6 font-medium uppercase tracking-widest text-[10px]">No players in your portfolio yet</div>
          <Link to="/market" className="px-8 py-4 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl shadow-lg hover:bg-emerald-400 transition-all active:scale-95 inline-block">
            Visit Transfer Market
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <div className="text-zinc-600 mb-2 font-medium uppercase tracking-widest text-[10px]">Inga träffar</div>
          <p className="text-zinc-500 text-sm">Ingen spelare i din trupp matchar "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <CardItem
              key={item.id}
              player={item.player}
              variant="sell"
              actionLabel="Lista / Sälj"
              onAction={() => handleSell(item.id)}
              isProcessing={sellingId === item.id}
              isListed={item.status === 'Available'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
