
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { user, changePassword, updateProfile } = useAuth();
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({
        username: editUsername,
        email: editEmail,
        avatar: editAvatar
      });
      setIsEditing(false);
    } catch (err) {
      alert('Kunde inte uppdatera profilen');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPass !== confirmPass) {
      setError('Nya lösenord matchar inte.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPass, newPass);
      setSuccess(true);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => {
        setSuccess(false);
        setIsChangingPassword(false);
      }, 3000);
    } catch (err: any) {
      setError(err || 'Det gick inte att ändra lösenordet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="px-8 pb-12 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-8 gap-6">
            <div className="relative group/avatar">
              <img 
                src={isEditing ? editAvatar : user.avatar} 
                alt="Avatar" 
                className={`w-32 h-32 rounded-3xl border-4 border-zinc-900 bg-black p-2 shadow-2xl transition-all ${isEditing ? 'opacity-70 scale-95' : ''}`}
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-emerald-500 text-black px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">
                    Edit Mode
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                {isEditing ? editUsername : user.username}
              </h1>
              <p className="text-emerald-400 font-bold uppercase text-xs tracking-widest">
                {user.role === 'admin' ? 'System Administrator' : 'Elite Trader'}
              </p>
            </div>

            <div className="flex space-x-4">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-xs uppercase transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditUsername(user.username);
                      setEditEmail(user.email);
                      setEditAvatar(user.avatar);
                    }}
                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-xs uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleProfileSubmit}
                    disabled={profileLoading}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold text-xs uppercase transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-xl">
            <div className="space-y-12">
              {/* Account Details */}
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Account Details</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col p-4 bg-black/40 rounded-xl border border-zinc-800/50 transition-all focus-within:border-emerald-500/50">
                      <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Username</span>
                      {isEditing ? (
                        <input 
                          value={editUsername}
                          onChange={e => setEditUsername(e.target.value)}
                          className="bg-transparent text-white font-medium text-sm outline-none w-full"
                          placeholder="Ange användarnamn"
                        />
                      ) : (
                        <span className="text-white font-medium text-sm">{user.username}</span>
                      )}
                    </div>

                    <div className="flex flex-col p-4 bg-black/40 rounded-xl border border-zinc-800/50 transition-all focus-within:border-emerald-500/50">
                      <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Email Address</span>
                      {isEditing ? (
                        <input 
                          type="email"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          className="bg-transparent text-white font-medium text-sm outline-none w-full"
                          placeholder="Ange e-post"
                        />
                      ) : (
                        <span className="text-white font-medium text-sm">{user.email}</span>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex flex-col p-4 bg-black/40 rounded-xl border border-zinc-800/50 animate-in fade-in slide-in-from-left-2 transition-all focus-within:border-emerald-500/50">
                        <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Avatar URL</span>
                        <input 
                          value={editAvatar}
                          onChange={e => setEditAvatar(e.target.value)}
                          className="bg-transparent text-white font-medium text-sm outline-none w-full"
                          placeholder="https://picsum.photos/..."
                        />
                        <p className="text-[8px] text-zinc-600 mt-2 font-bold uppercase tracking-tighter italic">Länka till en bild eller använd en DiceBear-seed.</p>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex justify-between p-4 bg-black/40 rounded-xl border border-zinc-800/50">
                        <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1 flex items-end">Member Since</span>
                        <span className="text-white font-medium text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {/* Security Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Security Settings</h3>
                  {!isChangingPassword && (
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 transition-colors tracking-widest"
                    >
                      Change Password
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800/50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Current Password</label>
                        <input 
                          type="password"
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          required
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">New Password</label>
                          <input 
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                            placeholder="Minst 6 tecken"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Confirm New Password</label>
                          <input 
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                            placeholder="Bekräfta"
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                          {error}
                        </p>
                      )}

                      {success && (
                        <p className="text-emerald-400 text-xs font-bold bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Password updated successfully!
                        </p>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setIsChangingPassword(false)}
                          className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={loading || success}
                          className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-4 bg-black/20 rounded-xl border border-dashed border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <span className="text-zinc-500 text-xs">Password was last changed recently.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
