
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Layout/Navbar';
import { Home } from './pages/Home';
import { Market } from './pages/Market';
import { Portfolio } from './pages/Portfolio';
import { Transactions } from './pages/Transactions';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/market" replace />;
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/market" 
            element={<ProtectedRoute><Market /></ProtectedRoute>} 
          />
          <Route 
            path="/portfolio" 
            element={<ProtectedRoute><Portfolio /></ProtectedRoute>} 
          />
          <Route 
            path="/transactions" 
            element={<ProtectedRoute><Transactions /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;

