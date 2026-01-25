
import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';

type FilterType = 'ALL' | 'BUY' | 'SELL';

export const Transactions: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredHistory = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter(tx => tx.type === filter);
  }, [transactions, filter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Trade History</h1>
          <p className="text-zinc-500">Full audit log of your market activities.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
           <button 
             onClick={() => setFilter('ALL')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
               filter === 'ALL' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
             }`}
           >
             All Activities
           </button>
           <button 
             onClick={() => setFilter('BUY')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
               filter === 'BUY' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
             }`}
           >
             Buy Only
           </button>
           <button 
             onClick={() => setFilter('SELL')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
               filter === 'SELL' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
             }`}
           >
             Sell Only
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
            <p className="text-zinc-400 font-medium">No {filter !== 'ALL' ? filter.toLowerCase() : ''} transactions found.</p>
            <p className="text-zinc-600 text-sm mt-1">Start trading in the market to build your history.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Player Asset</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredHistory.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-800/30 transition-colors">
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
                    <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Verified Asset</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`font-mono text-sm ${tx.type === 'BUY' ? 'text-zinc-400' : 'text-emerald-400 font-bold'}`}>
                      {tx.type === 'BUY' ? '-' : '+'}€{tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-xs text-zinc-400">{new Date(tx.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-zinc-600 uppercase font-bold">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between px-6 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
        <span>History verified by FootyTrade Ledger</span>
        <span>Showing {filteredHistory.length} of {transactions.length} records</span>
      </div>
    </div>
  );
};
