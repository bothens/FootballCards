
import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../api/api';
import type { PlayerIdentity, Player } from '../types/ui/types';
import { SearchInput } from '../components/Common/SearchInput';

export const AdminDashboard: React.FC = () => {
  const [playerDb, setPlayerDb] = useState<(PlayerIdentity & { supply: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Player Form
  const [newName, setNewName] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [newPos, setNewPos] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>('FWD');
  const [newImg, setNewImg] = useState('');

  // Issue Card state
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [cardPrice, setCardPrice] = useState(1000000);
  const [cardRarity, setCardRarity] = useState<Player['rarity']>('Common');

  const loadData = async () => {
    setLoading(true);
    const data = await api.getPlayerDb();
    setPlayerDb(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPlayerDb = useMemo(() => {
    return playerDb.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [playerDb, searchTerm]);

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPlayerIdentity({
        name: newName,
        team: newTeam,
        position: newPos,
        image: newImg || `https://picsum.photos/seed/${newName}/300/400`
      });
      alert('Spelare tillagd i databasen!');
      setNewName(''); setNewTeam(''); setNewImg('');
      loadData();
    } catch (err) {
      alert(err);
    }
  };

  const handleIssueCard = async (id: string) => {
    try {
      await api.issueCard(id, cardPrice, cardRarity);
      alert('Kort tillagt på marknaden!');
      setIssuingId(null);
      loadData(); // Refresh supply counts
    } catch (err) {
      alert(err);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Accessing Control Panel...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Admin Panel</h1>
        <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest mt-1">Asset Control & Global Database</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* STEP 1: CREATE IDENTITY */}
        <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl h-fit">
          <div className="flex items-center space-x-3 mb-6">
            <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black">1</span>
            <h2 className="text-xl font-bold italic tracking-tight uppercase">Definiera Spelare</h2>
          </div>
          <p className="text-zinc-500 text-xs mb-6">En spelare måste först skapas i databasen innan den kan ges ut som ett säljbart kort.</p>
          
          <form onSubmit={handleCreatePlayer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Namn</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Spelarens namn" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Lag</label>
                <input value={newTeam} onChange={e => setNewTeam(e.target.value)} required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none" placeholder="Klubb" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Position</label>
              <select value={newPos} onChange={e => setNewPos(e.target.value as any)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                <option value="GK">GK</option>
                <option value="DEF">DEF</option>
                <option value="MID">MID</option>
                <option value="FWD">FWD</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Bild URL</label>
              <input value={newImg} onChange={e => setNewImg(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors">Spara i Databasen</button>
          </form>
        </section>

        {/* STEP 2: ISSUE CARD */}
        <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col max-h-[700px]">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">2</span>
            <h2 className="text-xl font-bold italic tracking-tight uppercase">Ge ut Marknadskort</h2>
          </div>
          
          <SearchInput 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Sök i spelardatabas..." 
            className="mb-6"
          />

          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {filteredPlayerDb.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-sm italic">Hittade inga sparade spelare.</div>
            ) : (
              filteredPlayerDb.map(p => (
                <div key={p.id} className="p-4 bg-black rounded-2xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="relative overflow-hidden w-12 h-12 rounded-lg">
                      <img src={p.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center space-x-2">
                        <span>{p.name}</span>
                        {p.supply > 0 && (
                           <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded border border-emerald-500/20">
                             SUPPLY: {p.supply}
                           </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">{p.team} • {p.position}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIssuingId(p.id)}
                    className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-lg hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                  >
                    Ge ut Kort
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ISSUE MODAL */}
      {issuingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold italic uppercase tracking-tighter text-white">Mint Card</h3>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">From database identity</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Marknadspris (€)</label>
                <input type="number" value={cardPrice} onChange={e => setCardPrice(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Rarity Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Common', 'Rare', 'Epic', 'Legendary'] as const).map(r => (
                    <button 
                      key={r}
                      onClick={() => setCardRarity(r)}
                      className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all border ${
                        cardRarity === r 
                          ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-black text-zinc-500 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIssuingId(null)} className="flex-1 py-4 text-zinc-500 text-[10px] font-black uppercase hover:text-white transition-colors">Avbryt</button>
                <button onClick={() => handleIssueCard(issuingId)} className="flex-1 py-4 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-emerald-400 transition-all">Skapa & Lista</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
