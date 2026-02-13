
import React, { useState } from 'react';
import type { Player } from '../../types/ui/types';
import { useI18n } from '../../hooks/useI18n';

interface CardItemProps {
  player: Player;
  actionLabel: string;
  onAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'buy' | 'sell';
  isProcessing?: boolean;
  isListed?: boolean;
  currentBid?: number | null;
}

export const CardItem: React.FC<CardItemProps> = ({ 
  player, 
  actionLabel, 
  onAction, 
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'buy',
  isProcessing = false,
  isListed = false,
  currentBid = null
}) => {
  const { t } = useI18n();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `EUR ${(price / 1000000).toFixed(2)}M`;
    }
    return `EUR ${price.toLocaleString()}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
  };

  // Konfiguration för stilar baserat på spelarens raritet
  const rarityStyles = {
    Common: {
      border: 'border-zinc-700/70',
      bg: 'from-zinc-700/40 via-zinc-900 to-black',
      glow: 'group-hover:shadow-zinc-500/10',
      accent: 'text-zinc-300',
      badge: 'bg-zinc-700/80 text-zinc-200',
      holographic: 'bg-gradient-to-tr from-transparent via-zinc-300/5 to-transparent'
    },
    Rare: {
      border: 'border-blue-500/50',
      bg: 'from-blue-900/40 via-zinc-900 to-black',
      glow: 'group-hover:shadow-blue-500/30',
      accent: 'text-blue-400',
      badge: 'bg-blue-600 text-white',
      holographic: 'bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent'
    },
    Epic: {
      border: 'border-purple-400/80',
      bg: 'from-purple-700/40 via-zinc-900 to-black',
      glow: 'group-hover:shadow-purple-500/60',
      accent: 'text-purple-300',
      badge: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white',
      holographic: 'bg-gradient-to-tr from-transparent via-purple-300/30 to-transparent'
    },
    Legendary: {
      border: 'border-amber-400/80',
      bg: 'from-amber-600/30 via-zinc-900 to-black',
      glow: 'group-hover:shadow-amber-400/50',
      accent: 'text-amber-400',
      badge: 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black',
      holographic: 'bg-gradient-to-tr from-transparent via-white/20 to-transparent'
    },
    Skiller: {
      border: 'border-rose-400/70',
      bg: 'from-rose-700/30 via-zinc-900 to-black',
      glow: 'group-hover:shadow-rose-500/50',
      accent: 'text-rose-300',
      badge: 'bg-gradient-to-r from-rose-500 to-orange-400 text-black',
      holographic: 'bg-gradient-to-tr from-transparent via-rose-300/30 to-transparent'
    },
    'Historical Moment': {
      border: 'border-slate-300/70',
      bg: 'from-slate-600/40 via-zinc-900 to-black',
      glow: 'group-hover:shadow-slate-300/40',
      accent: 'text-slate-200',
      badge: 'bg-gradient-to-r from-slate-200 to-zinc-400 text-black',
      holographic: 'bg-gradient-to-tr from-transparent via-slate-200/25 to-transparent'
    }
  };

  const style = rarityStyles[player.rarity];
  
  const disabled = isProcessing || isListed;
  const hasSecondary = Boolean(secondaryActionLabel && onSecondaryAction);

  const borderWeight =
    player.rarity === 'Common'
      ? 'border'
      : player.rarity === 'Epic'
      ? 'border-[3px]'
      : 'border-2';
  const isEpic = player.rarity === 'Epic';
  const epicInlineStyle = isEpic
    ? {
        boxShadow: '0 0 0 4px rgba(168,85,247,0.9), 0 0 25px rgba(168,85,247,0.6)',
      }
    : undefined;
  const isSkiller = player.rarity === 'Skiller';
  const skillerInlineStyle = isSkiller
    ? {
        boxShadow:
          '0 0 0 4px rgba(244,63,94,0.95), 0 0 60px rgba(251,113,133,0.9), 0 0 120px rgba(244,63,94,0.6), 0 0 200px rgba(255,120,60,0.35)',
      }
    : undefined;
  const cardStyle = epicInlineStyle || skillerInlineStyle;
  const isHistorical = player.rarity === 'Historical Moment';
  const historicalInlineStyle = isHistorical
    ? {
        boxShadow:
          '0 0 0 5px rgba(226,232,240,0.9), 0 0 70px rgba(148,163,184,0.7), 0 0 140px rgba(148,163,184,0.45), 0 0 220px rgba(226,232,240,0.25)',
      }
    : undefined;
  const mergedStyle = skillerInlineStyle || epicInlineStyle || historicalInlineStyle;
  const skillerOverlayStyle = isSkiller
    ? {
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(255,120,120,0.55), transparent 45%),' +
          'radial-gradient(circle at 85% 25%, rgba(255,80,120,0.5), transparent 40%),' +
          'radial-gradient(circle at 40% 85%, rgba(255,140,120,0.45), transparent 45%),' +
          'linear-gradient(120deg, rgba(255,80,80,0.45), transparent 40%),' +
          'linear-gradient(300deg, rgba(255,160,80,0.35), transparent 50%)',
      }
    : undefined;

  return (
    <div
      className={`group relative flex flex-col rounded-[2rem] ${borderWeight} ${style.border} bg-gradient-to-br ${style.bg} overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] shadow-2xl ${style.glow} h-[520px]`}
      style={mergedStyle}
    >
      {isEpic && (
        <div className="absolute inset-[8px] z-20 rounded-[1.5rem] pointer-events-none border-4 border-purple-400/90" />
      )}
      {isSkiller && (
        <div className="absolute inset-[8px] z-30 rounded-[1.55rem] pointer-events-none border-[4px] border-rose-300/95 shadow-[inset_0_0_40px_rgba(255,90,120,0.9)] animate-[pulse_2.2s_ease-in-out_infinite]" />
      )}
      {isSkiller && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-95 bg-[radial-gradient(circle_at_18%_18%,rgba(255,120,120,0.8),transparent_38%),radial-gradient(circle_at_82%_26%,rgba(255,60,120,0.7),transparent_36%),radial-gradient(circle_at_30%_82%,rgba(255,160,80,0.7),transparent_38%)] mix-blend-screen animate-[pulse_2s_ease-in-out_infinite]" />
      )}
      {isSkiller && (
        <div className="absolute inset-1 z-30 pointer-events-none rounded-[1.7rem] border border-rose-200/60 shadow-[0_0_26px_rgba(255,120,140,0.9)]" />
      )}
      {isSkiller && (
        <div className="absolute -inset-[10px] z-10 pointer-events-none rounded-[2.4rem] blur-[4px] opacity-95 bg-[conic-gradient(from_90deg,rgba(255,40,40,1),rgba(255,140,40,0.95),rgba(255,40,120,0.95),rgba(255,220,120,0.95),rgba(255,40,40,1))] animate-[spin_3.5s_linear_infinite]" />
      )}
      {isSkiller && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-80 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.12)_0_2px,transparent_2px_8px)] mix-blend-screen" />
      )}
      {isSkiller && (
        <div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-100 animate-[pulse_2.4s_ease-in-out_infinite]"
          style={skillerOverlayStyle}
        />
      )}
      {isSkiller && (
        <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_55%)] mix-blend-screen" />
      )}
      {isHistorical && (
        <div className="absolute inset-[5px] z-30 rounded-[1.6rem] pointer-events-none border-[5px] border-slate-100/95 shadow-[inset_0_0_60px_rgba(226,232,240,0.9)]" />
      )}
      {isHistorical && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-95 bg-[radial-gradient(circle_at_20%_20%,rgba(226,232,240,0.7),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(148,163,184,0.55),transparent_36%),radial-gradient(circle_at_35%_80%,rgba(226,232,240,0.5),transparent_40%)] mix-blend-screen" />
      )}
      {isHistorical && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-60 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_45%),linear-gradient(315deg,rgba(226,232,240,0.2)_0%,transparent_50%)] mix-blend-screen" />
      )}
      {isHistorical && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-55 bg-[radial-gradient(circle_at_10%_15%,rgba(255,255,255,0.35)_0_1px,transparent_1px_6px),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.3)_0_1px,transparent_1px_7px),radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.28)_0_1px,transparent_1px_6px)] mix-blend-screen" />
      )}
      {isHistorical && (
        <div className="absolute inset-0 z-30 pointer-events-none opacity-95 bg-[radial-gradient(circle_at_55%_35%,rgba(255,255,255,0.55),transparent_35%)] mix-blend-screen" />
      )}
      {isHistorical && (
        <div className="absolute -inset-[16px] z-10 pointer-events-none rounded-[2.7rem] blur-[10px] opacity-95 bg-[conic-gradient(from_120deg,rgba(226,232,240,1),rgba(148,163,184,0.85),rgba(226,232,240,1))] animate-[spin_3.5s_linear_infinite]" />
      )}
      {isHistorical && (
        <div className="absolute inset-0 z-20 pointer-events-none opacity-7 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.24)_0_2px,transparent_2px_7px)] mix-blend-screen" />
      )}
      {isHistorical && (
        <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.22),transparent_55%)] mix-blend-screen" />
      )}
      
      {/* 1. HOLOGRAFISK EFFEKT (Sveper vid hover) */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${style.holographic} -translate-x-full group-hover:translate-x-full transform transition-transform ease-in-out`}></div>

      {/* 2. TOP SECTION: SPELARBILD */}
      <div className="relative h-[360px] w-full overflow-hidden">
        {/* Huvudbild med subtil zoom-effekt vid hover */}
        <img 
          src={player.image} 
          alt={player.name} 
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageFailed(true);
            setImageLoaded(true);
          }}
          loading="lazy"
        />

        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-500">
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-black">
                {getInitials(player.name)}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-black">{t('loading')}</span>
            </div>
          </div>
        )}

        {imageFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 text-zinc-400">
            <span className="text-xs uppercase tracking-widest font-black">{t('imageUnavailable')}</span>
          </div>
        )}
        
        {/* Gradient-overlay för att mjuka upp bilden mot namnet */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        
        {/* Position-badge uppe till vänster */}
        <div className="absolute top-6 left-6 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-lg ${style.badge} flex items-center justify-center font-black text-sm shadow-xl border border-white/10`}>
              {player.position}
            </div>
            {/* Dekorativ vertikal linje */}
            <div className="mt-2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* Rarity Label (Vertikal text på höger sida) */}
        <div className="absolute top-6 right-4">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 [writing-mode:vertical-lr] rotate-180">
             {player.rarity}
           </span>
        </div>

        {variant === 'buy' && (
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md px-4 py-3 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{t('quickView')}</div>
                <div className="text-white font-black">{player.team}</div>
              </div>
              <div className={`font-black ${style.accent}`}>{formatPrice(player.price)}</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MIDDLE SECTION: NAMN & KLUBB (Glassmorphism-look) */}
      <div className="relative px-6 -mt-10 mb-2">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-emerald-400 transition-colors">
              {player.name}
            </h3>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{player.team}</span>
            </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: PRIS & ACTION */}
      <div className="mt-auto px-6 pb-6 pt-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">{t('marketValue')}</span>
            <div className="flex items-baseline space-x-1">
                <span className={`text-xl font-black italic tracking-tighter ${style.accent}`}>
                  {formatPrice(player.price)}
                </span>
            </div>
            {currentBid !== null && (
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mt-2">
                {t('currentBid')}: EUR {currentBid.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  onAction();
                }
              }}
              disabled={disabled}
              className={`h-12 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center ${
                variant === 'buy' 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 hover:shadow-[0_0_18px_rgba(16,185,129,0.25)]' 
                  : isListed
                    ? 'bg-zinc-700 text-zinc-400 border border-white/5'
                    : 'bg-zinc-800 hover:bg-red-500 text-white border border-white/5 hover:border-red-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  {!isListed && (
                    variant === 'buy' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    )
                  )}
                  {isListed ? t('alreadyListed') : actionLabel}
                </span>
              )}
            </button>
            {hasSecondary && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSecondaryAction?.();
                }}
                className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/70 hover:text-white hover:border-emerald-500/60 transition-colors"
                type="button"
              >
                {secondaryActionLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Glossy Overlay Highlight (Ger kortet en fysisk plastkänsla) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};



