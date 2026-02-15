import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import MarketService from '../services/MarketService';
import { CardItem } from '../components/Card/CardItem';
import type { OpenPackRequestDto, OpenPackResultDto } from '../types/dtos/market';
import { mapPosition, mapRarity } from '../utils/cardMapper';

export const Packs: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { t } = useI18n();
  const [openingPack, setOpeningPack] = useState<OpenPackRequestDto['packType'] | null>(null);
  const [lastDrop, setLastDrop] = useState<OpenPackResultDto['card'] | null>(null);
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [revealCard, setRevealCard] = useState<OpenPackResultDto['card'] | null>(null);

  const handleOpenPack = async (packType: OpenPackRequestDto['packType']) => {
    if (!user) {
      alert(t('mustLoginToBuy'));
      return;
    }

    if (user.role === 'admin') {
      alert(t('adminNoTrade'));
      return;
    }

    setOpeningPack(packType);
    setRevealCard(null);
    setIsSpinOpen(true);
    try {
      const [result] = await Promise.all([
        MarketService.openPack({ packType }),
        new Promise((resolve) => setTimeout(resolve, 2200)),
      ]);
      updateBalance(result.balanceAfterOpen);
      setLastDrop(result.card);
      setRevealCard(result.card);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('packOpenFailed');
      alert(message);
      setIsSpinOpen(false);
    } finally {
      setOpeningPack(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
          {t('packsTitle')}
        </h2>
        <p className="text-zinc-500 text-sm">{t('packsSubtitle')}</p>
      </header>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { key: 'starter', price: 250, desc: t('packDesc_starter') },
            { key: 'premium', price: 500, desc: t('packDesc_premium') },
            { key: 'elite', price: 1000, desc: t('packDesc_elite') },
          ] as const).map((pack) => (
            <div key={pack.key} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t(`packName_${pack.key}`)}</p>
              <p className="mt-2 text-2xl font-black italic">EUR {pack.price}</p>
              <p className="mt-2 text-xs text-zinc-400 min-h-10">{pack.desc}</p>
              <button
                type="button"
                onClick={() => handleOpenPack(pack.key)}
                disabled={openingPack !== null}
                className="mt-4 h-10 w-full rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {openingPack === pack.key ? t('openingPack') : t('openPack')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {lastDrop && (
        <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-widest text-emerald-300">{t('latestDrop')}</p>
          <p className="mt-2 text-lg font-black italic">{lastDrop.playerName}</p>
          <p className="text-xs text-zinc-300">{lastDrop.cardType} • EUR {lastDrop.price.toLocaleString()}</p>
        </section>
      )}

      {isSpinOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            {!revealCard ? (
              <>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">{t('openingPack')}</p>
                <div
                  className="mx-auto h-52 w-52 rounded-full animate-spin"
                  style={{
                    animationDuration: '1.1s',
                    background:
                      'conic-gradient(#6b7280 0deg 60deg, #3b82f6 60deg 120deg, #a855f7 120deg 180deg, #f59e0b 180deg 240deg, #f43f5e 240deg 300deg, #cbd5e1 300deg 360deg)',
                    boxShadow: '0 0 35px rgba(255,255,255,0.16)',
                  }}
                />
                <div className="mx-auto -mt-32 h-24 w-24 rounded-full bg-black border border-zinc-700" />
              </>
            ) : (
              <>
                <p className="text-xl font-black italic text-emerald-300">{t('packCongrats')}</p>
                <p className="mt-2 text-sm text-zinc-300">
                  {t('packWon', {
                    name: revealCard.playerName,
                    value: `EUR ${revealCard.price.toLocaleString()}`,
                  })}
                </p>
                <div className="mt-4 mx-auto max-w-[350px]">
                  <CardItem
                    player={{
                      id: String(revealCard.playerId),
                      identityId: String(revealCard.playerId),
                      name: revealCard.playerName,
                      team: revealCard.playerTeam || 'Unknown Team',
                      position: mapPosition(revealCard.playerPosition),
                      price: revealCard.price,
                      image: revealCard.cardImageUrl || revealCard.playerImageUrl,
                      rarity: mapRarity(revealCard.cardType),
                    }}
                    actionLabel={t('close')}
                    onAction={() => {
                      setIsSpinOpen(false);
                      setRevealCard(null);
                    }}
                    variant="buy"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
