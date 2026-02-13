import React, { useState, useMemo } from 'react';
import { useMarketCards } from '../hooks/useMarket';
import { CardItem } from '../components/Card/CardItem';
import { useAuth } from '../hooks/useAuth';
import MarketService from '../services/MarketService';
import { CardSortAndFilter } from '../components/Card/CardSortAndFilter';
import { useI18n } from '../hooks/useI18n';

export const Market: React.FC = () => {
  const { cards, loading, error, refresh, setParams } = useMarketCards();
  const { user, updateBalance } = useAuth();
  const { t } = useI18n();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bidTarget, setBidTarget] = useState<(typeof cards)[number] | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(
    () => localStorage.getItem('ft_show_welcome') === 'true'
  );

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      card.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setParams({ search: term || undefined });
  };

  const handleBuy = async (cardId: number) => {
    if (!user) {
      alert(t('mustLoginToBuy'));
      return;
    }

    if (user.role === 'admin') {
      alert(t('adminNoTrade'));
      return;
    }

    setBuyingId(cardId.toString());

    try {
      const purchasedCard = await MarketService.purchaseCard({ cardId });

      if (!purchasedCard || purchasedCard.status !== 'Owned') {
        alert(t('purchaseFailed'));
      } else {
        alert(
          t('purchaseSuccess', {
            name: purchasedCard.playerName,
            price: purchasedCard.price,
          })
        );
        if (user?.balance !== undefined) {
          updateBalance(Math.max(0, user.balance - purchasedCard.price));
        }
      }

      await refresh();
    } catch (err: unknown) {
      console.error('Purchase failed:', err);
      const message = err instanceof Error ? err.message : t('purchaseFailedGeneric');
      alert(message);
    } finally {
      setBuyingId(null);
    }
  };

  const openBid = (card: (typeof cards)[number]) => {
    setBidTarget(card);
    setBidAmount('');
  };

  const submitBid = async () => {
    if (!bidTarget) return;

    const normalized = bidAmount.replace(/[, ]/g, '');
    const amount = Number(normalized);
    if (!Number.isFinite(amount)) {
      alert(t('bidMustBeNumber'));
      return;
    }
    if (amount <= 0) {
      alert(t('bidMustBePositive'));
      return;
    }
    const currentHighest = bidTarget.highestBid ?? 0;
    if (amount <= currentHighest) {
      alert(t('bidMustBeHigher'));
      return;
    }

    setBidSubmitting(true);
    try {
      await MarketService.bidCard({ cardId: Number(bidTarget.id), bidAmount: amount });
      alert(t('bidPlaced'));
      setBidTarget(null);
      setBidAmount('');
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('purchaseFailedGeneric');
      alert(message);
    } finally {
      setBidSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 animate-pulse font-medium uppercase tracking-widest text-xs">{t('marketScan')}</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const dismissWelcome = () => {
    if (user?.id) {
      localStorage.setItem(`ft_welcome_seen_${user.id}`, 'true');
    }
    localStorage.setItem('ft_show_welcome', 'false');
    setShowWelcome(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">{t('transferMarket')}</h2>
          <p className="text-zinc-500 text-sm">{t('marketSubtitle')}</p>
        </div>
      </header>

      <div className="sticky top-20 z-40 mb-8 rounded-2xl border border-zinc-800 bg-black/70 backdrop-blur-md px-4 py-3">
        <CardSortAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onFilterChange={(filter) => setParams({ filter })}
          onSortChange={(sort) => setParams({ sort })}
        />
      </div>

      {showWelcome && user && (
        <div className="mb-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-black text-emerald-300">{t('welcomeTitle')}</p>
              <h3 className="text-2xl font-black italic mt-1">{t('welcomeSubtitle')}</h3>
              <p className="text-zinc-300 text-sm mt-2 max-w-2xl">
                {t('welcomeBody')}
              </p>
            </div>
            <button
              onClick={dismissWelcome}
              className="h-10 px-4 rounded-xl bg-black/40 border border-emerald-500/40 text-xs font-black uppercase tracking-widest text-emerald-200 hover:bg-black/60 transition-colors"
              type="button"
            >
              {t('gotIt')}
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <p className="uppercase font-black tracking-widest text-[10px] text-zinc-400 mb-2">{t('step1Title')}</p>
              <p>{t('step1BodyMarket')}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <p className="uppercase font-black tracking-widest text-[10px] text-zinc-400 mb-2">{t('step2Title')}</p>
              <p>{t('step2BodyMarket')}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <p className="uppercase font-black tracking-widest text-[10px] text-zinc-400 mb-2">{t('step3Title')}</p>
              <p>{t('step3BodyMarket')}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {filteredCards.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500 uppercase text-xs font-black tracking-widest mb-2">
            {searchTerm ? t('noHits') : t('marketSoldOut')}
          </p>
          <p className="text-zinc-600">
            {searchTerm ? t('noHitsDetail', { term: searchTerm }) : t('noPlayersAvailable')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <CardItem
              key={card.id}
              player={card.player}
              actionLabel={isAdmin ? t('adminView') : t('buy')}
              secondaryActionLabel={isAdmin ? undefined : t('bid')}
              onSecondaryAction={isAdmin ? undefined : () => openBid(card)}
              currentBid={card.highestBid ?? null}
              onAction={() => handleBuy(Number(card.id))}
              isProcessing={buyingId === card.id.toString()}
            />
          ))}
        </div>
      )}

      {bidTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black">{t('placeBid')}</h3>
                <p className="text-xs text-zinc-500">{bidTarget.player.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setBidTarget(null)}
                className="text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-white"
              >
                {t('close')}
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-xs text-zinc-300">
              {t('currentBid')}: EUR {(bidTarget.highestBid ?? 0).toLocaleString()}
            </div>

            <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
              {t('bidAmount')}
            </label>
            <input
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="EUR"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setBidTarget(null)}
                className="flex-1 h-11 rounded-xl bg-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-zinc-700 transition-colors"
                disabled={bidSubmitting}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={submitBid}
                className="flex-1 h-11 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50"
                disabled={bidSubmitting}
              >
                {t('confirmBid')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


