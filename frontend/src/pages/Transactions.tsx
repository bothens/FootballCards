
import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useI18n } from '../hooks/useI18n';

type FilterType = 'ALL' | 'BUY' | 'SELL';

export const Transactions: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const { t } = useI18n();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredHistory = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter(tx => tx.type === filter);
  }, [transactions, filter]);

  const groupedHistory = useMemo(() => {
    const groups: { dateKey: string; dateLabel: string; items: typeof filteredHistory }[] = [];
    const map = new Map<string, { dateKey: string; dateLabel: string; items: typeof filteredHistory }>();
    for (const tx of filteredHistory) {
      const date = new Date(tx.timestamp);
      const dateKey = date.toDateString();
      const dateLabel = date.toLocaleDateString();
      if (!map.has(dateKey)) {
        const group = { dateKey, dateLabel, items: [] as typeof filteredHistory };
        map.set(dateKey, group);
        groups.push(group);
      }
      map.get(dateKey)!.items.push(tx);
    }
    return groups;
  }, [filteredHistory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{t('tradeHistory')}</h1>
          <p className="text-zinc-500">{t('transactionsSubtitle')}</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
           <button 
             onClick={() => setFilter('ALL')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
               filter === 'ALL' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
             }`}
           >
             {t('allActivities')}
           </button>
           <button 
             onClick={() => setFilter('BUY')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
               filter === 'BUY' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
             }`}
           >
             {t('buyOnly')}
           </button>
           <button 
             onClick={() => setFilter('SELL')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
               filter === 'SELL' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
             }`}
           >
             {t('sellOnly')}
           </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-24 flex justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-24 text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <p className="text-zinc-400 font-medium">{t('noTransactionsFound')}</p>
            <p className="text-zinc-600 text-sm mt-1">{t('startTrading')}</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                <th className="px-8 py-5">{t('type')}</th>
                <th className="px-8 py-5">{t('playerAsset')}</th>
                <th className="px-8 py-5">{t('value')}</th>
                <th className="px-8 py-5 text-right">{t('timestamp')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {groupedHistory.map((group) => (
                <React.Fragment key={group.dateKey}>
                  <tr className="bg-black/50">
                    <td colSpan={4} className="px-8 py-3 text-[10px] uppercase tracking-widest font-black text-zinc-500">
                      {group.dateLabel}
                    </td>
                  </tr>
                  {group.items.map((tx) => (
                    <React.Fragment key={tx.id}>
                      <tr
                        className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                      >
                        <td className="px-8 py-6">
                          <span className={`
                            px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                            ${tx.type === 'BUY' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}
                          `}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-bold text-white block">{tx.playerName}</span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{t('verifiedAsset')}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`font-mono text-sm ${tx.type === 'BUY' ? 'text-zinc-400' : 'text-emerald-400 font-bold'}`}>
                            {tx.type === 'BUY' ? '-' : '+'}EUR {tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="text-xs text-zinc-400">{new Date(tx.timestamp).toLocaleDateString()}</div>
                          <div className="text-[10px] text-zinc-600 uppercase font-bold">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                      </tr>
                      {expandedId === tx.id && (
                        <tr className="bg-black/30">
                          <td colSpan={4} className="px-8 pb-6 text-xs text-zinc-400">
                            <div className="flex flex-wrap gap-6">
                              <div>
                                <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t('cardType')}</div>
                                <div className="text-white font-bold">{tx.cardType}</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t('amount')}</div>
                                <div className="text-white font-bold">EUR {tx.amount.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t('timestamp')}</div>
                                <div className="text-white font-bold">{new Date(tx.timestamp).toLocaleString()}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between px-6 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
        <span>{t('historyVerified')}</span>
        <span>{t('showingRecords', { shown: filteredHistory.length, total: transactions.length })}</span>
      </div>
    </div>
  );
};



