import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { CardItem } from '../components/Card/CardItem';
import { Link } from 'react-router-dom';
import { SearchInput } from '../components/Common/SearchInput';
import { useI18n } from '../hooks/useI18n';

export const Portfolio: React.FC = () => {
  const { items, loading, error, sellItem } = usePortfolio();
  const { t } = useI18n();
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [listingTarget, setListingTarget] = useState<(typeof items)[number] | null>(null);
  const [listingPrice, setListingPrice] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);
  const totalValue = useMemo(
    () => items.reduce((sum, item) => sum + (item.player.price || 0), 0),
    [items]
  );

  const handleSell = async (itemId: string) => {
    const target = items.find((item) => item.id === itemId);
    if (!target) return;
    setListingTarget(target);
    setListingPrice(String(target.player.price || ''));
  };

  const submitListing = async () => {
    if (!listingTarget) return;
    const normalized = listingPrice.replace(/[, ]/g, '');
    const sellingPrice = parseFloat(normalized);
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      alert(t('invalidPrice'));
      return;
    }
    setSellingId(listingTarget.id);
    try {
      await sellItem(listingTarget.id, sellingPrice);
      setListingTarget(null);
      setListingPrice('');
    } catch {
      alert(t('sellFailed'));
    } finally {
      setSellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">{t('auditingAssets')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic leading-none mb-2">{t('yourSquad')}</h2>
          <p className="text-zinc-500 text-sm">{t('portfolioSubtitle')}</p>
        </div>
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder={t('searchSquadPlaceholder')} 
          className="w-full sm:w-80"
        />
      </header>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-zinc-800 bg-black/30 px-4 py-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-widest text-[10px] font-black text-zinc-500">{t('portfolioCards')}</span>
          <span className="font-bold text-white">{items.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-widest text-[10px] font-black text-zinc-500">{t('portfolioValue')}</span>
          <span className="font-bold text-emerald-300">EUR {totalValue.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {error}
        </div>
      )}

      {listingTarget && (
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t('listCard')}</p>
              <p className="text-white font-black">{listingTarget.player.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                placeholder={t('priceInEur')}
                className="h-10 w-full sm:w-48 rounded-xl bg-black border border-zinc-800 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setListingTarget(null);
                    setListingPrice('');
                  }}
                  className="h-10 px-4 rounded-xl bg-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-zinc-700 transition-colors"
                  type="button"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={submitListing}
                  disabled={sellingId === listingTarget.id}
                  className="h-10 px-5 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50 hover:shadow-[0_0_18px_rgba(16,185,129,0.25)]"
                  type="button"
                >
                  {sellingId === listingTarget.id ? t('listing') : t('listCard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <div className="text-zinc-600 mb-6 font-medium uppercase tracking-widest text-[10px]">{t('noPortfolio')}</div>
          <Link to="/market" className="px-8 py-4 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl shadow-lg hover:bg-emerald-400 transition-all active:scale-95 hover:shadow-[0_0_18px_rgba(16,185,129,0.25)] inline-block">
            {t('visitTransferMarket')}
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <div className="text-zinc-600 mb-2 font-medium uppercase tracking-widest text-[10px]">{t('noMatches')}</div>
          <p className="text-zinc-500 text-sm">{t('noMatchesDetail', { term: searchTerm })}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <CardItem
              key={item.id}
              player={item.player}
              variant="sell"
              actionLabel={t('listSell')}
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


