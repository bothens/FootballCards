
import React from 'react';
import type { Player } from '../../types/types';

interface CardItemProps {
  player: Player;
  actionLabel: string;
  onAction: () => void;
  variant?: 'buy' | 'sell';
  isProcessing?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ 
  player, 
  actionLabel, 
  onAction, 
  variant = 'buy',
  isProcessing = false
}) => {
  // Konfiguration för stilar baserat på spelarens raritet
  const rarityStyles = {
    Common: {
      border: 'border-zinc-700',
      bg: 'from-zinc-800 via-zinc-900 to-black',
      glow: 'group-hover:shadow-zinc-500/20',
      accent: 'text-zinc-400',
      badge: 'bg-zinc-700 text-zinc-300',
      holographic: 'bg-gradient-to-tr from-transparent via-zinc-400/5 to-transparent'
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
      border: 'border-purple-500/60',
      bg: 'from-purple-900/40 via-zinc-900 to-black',
      glow: 'group-hover:shadow-purple-500/40',
      accent: 'text-purple-400',
      badge: 'bg-purple-600 text-white',
      holographic: 'bg-gradient-to-tr from-transparent via-purple-400/20 to-transparent'
    },
    Legendary: {
      border: 'border-amber-400/80',
      bg: 'from-amber-600/30 via-zinc-900 to-black',
      glow: 'group-hover:shadow-amber-400/50',
      accent: 'text-amber-400',
      badge: 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black',
      holographic: 'bg-gradient-to-tr from-transparent via-white/20 to-transparent'
    }
  };

  const style = rarityStyles[player.rarity];

  return (
    <div className={`group relative flex flex-col rounded-[2rem] border-2 ${style.border} bg-gradient-to-br ${style.bg} overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] shadow-2xl ${style.glow} h-[520px] cursor-pointer`}>
      
      {/* 1. HOLOGRAFISK EFFEKT (Sveper vid hover) */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${style.holographic} -translate-x-full group-hover:translate-x-full transform transition-transform ease-in-out`}></div>

      {/* 2. TOP SECTION: SPELARBILD */}
      <div className="relative h-[360px] w-full overflow-hidden">
        {/* Huvudbild med subtil zoom-effekt vid hover */}
        <img 
          src={player.image} 
          alt={player.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
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
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Marknadsvärde</span>
            <div className="flex items-baseline space-x-1">
                <span className={`text-xl font-black italic tracking-tighter ${style.accent}`}>
                  €{(player.price / 1000000).toFixed(1)}M
                </span>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation(); // Hindra klick på knappen från att trigga andra händelser
              onAction();
            }}
            disabled={isProcessing}
            className={`h-12 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center ${
              variant === 'buy' 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
              : 'bg-zinc-800 hover:bg-red-500 text-white border border-white/5 hover:border-red-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="flex items-center gap-2">
                {variant === 'buy' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                )}
                {actionLabel}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Glossy Overlay Highlight (Ger kortet en fysisk plastkänsla) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};
