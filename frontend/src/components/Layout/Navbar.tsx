
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: t('marketTitle'), path: '/market' },
    { label: t('portfolioTitle'), path: '/portfolio' },
    { label: t('transactionsTitle'), path: '/transactions' },
    { label: t('profileTitle'), path: '/profile' },
    { label: t('friendsNav'), path: '/friends' },
    { label: t('settings'), path: '/settings' },
  ];

  // Add Admin to nav items if user has the role
  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin', path: '/admin' });
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/market" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black text-xl">F</div>
              <span className="font-black text-xl tracking-tighter uppercase hidden sm:block">FootyTrade</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold leading-none">{t('balanceLabel')}</span>
              <span className="text-emerald-400 font-bold">EUR {(user?.balance || 0).toLocaleString()}</span>
            </div>
            
            <div className="h-8 w-[1px] bg-zinc-800"></div>

            <button 
              onClick={() => logout()}
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
              title={t('logout')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
            
            <Link to="/profile" className="flex items-center space-x-2 group">
              <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-zinc-700 group-hover:border-emerald-500 transition-colors" />
            </Link>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};



