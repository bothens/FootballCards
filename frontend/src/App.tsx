import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Navbar } from "./components/Layout/Navbar";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Notification } from "./components/Common/Notification";

import { Home } from "./pages/Home";
import { Market } from "./pages/Market";
import { Portfolio } from "./pages/Portfolio";
import { Transactions } from "./pages/Transactions";
import { Profile } from "./pages/Profile";
import { Packs } from "./pages/Packs";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Settings } from "./pages/Settings";
import { Friends } from "./pages/Friends";
import { FriendsChat } from "./pages/FriendsChat";
import { ChatBubble } from "./components/Chat/ChatBubble";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/market" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-black text-text dark:text-text-light">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? "pb-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <Market />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packs"
            element={
              <ProtectedRoute>
                <Packs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends/chat/:friendId"
            element={
              <ProtectedRoute>
                <FriendsChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {isAuthenticated && <ChatBubble />}
      <Notification />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
