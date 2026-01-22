
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Home: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (isAuthenticated) {
    return <Navigate to="/market" replace />;
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await login(email);
    } catch (err) {
      alert('Inloggning misslyckades');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'user' | 'admin') => {
    setLoading(true);
    try {
      await login(role);
    } catch (err) {
      alert('Inloggning misslyckades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <span className="text-black font-black text-4xl italic">F</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">FootyTrade Elite</h1>
          <p className="text-zinc-400 text-sm">Sign in to trade the world's finest football talent.</p>
        </div>

        <div className="bg-zinc-900/90 p-8 rounded-2xl border border-zinc-800 shadow-2xl mb-6">
          <div className="flex mb-8 bg-black p-1 rounded-xl">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'login' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              LOG IN
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'register' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="trader@elite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Enter Platform' : 'Create Account'}
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-[10px] text-center text-zinc-500 uppercase font-black tracking-widest mb-4">Quick Trader Access</p>
            <div className="flex gap-3">
              <button 
                onClick={() => handleQuickLogin('user')}
                disabled={loading}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black py-3 rounded-lg uppercase tracking-tighter transition-colors border border-zinc-700 disabled:opacity-50"
              >
                In som User
              </button>
              <button 
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                className="flex-1 bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-400 text-white text-[10px] font-black py-3 rounded-lg uppercase tracking-tighter transition-colors border border-zinc-700 hover:border-emerald-500/50 disabled:opacity-50"
              >
                In som Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest font-bold">
          Secure Trading Access Enabled
        </p>
      </div>
    </div>
  );
};
