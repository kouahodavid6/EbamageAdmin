import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Notifications from "./pages/Notifications/Notifications"
import Categories from './pages/Catégoties/categories';
import Variations from './pages/Variations/Variations';
import Boutiques from './pages/Boutiques/Boutiques';
import Clients from './pages/Clients/Clients';
import Commandes from './pages/Commandes/Commandes';
import Localisations from './pages/Localisations/Localisations';
import Profil from './pages/Profil/Profil';
import Finances from './pages/Finances/Finances';
import useAuthStore from './stores/auth.store';

import NotFound from './components/NotFound';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant pour les routes publiques (comme login)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth;
  }, [initializeAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Notifications toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#f5f3ff",
              color: "#4c1d95",
              border: "1px solid #c4b5fd",
              padding: "12px 16px",
              fontWeight: "500",
              fontSize: "14px",
            },
            success: {
              icon: <CheckCircle className="text-[#166534] w-5 h-5" />,
              style: {
                background: "#bbf7d0",
                color: "#166534",
                borderColor: "#4ade80",
              },
            },
            error: {
              icon: <XCircle className="text-[#7f1d1d] w-5 h-5" />,
              style: {
                background: "#fee2e2",
                color: "#7f1d1d",
                borderColor: "#fca5a5",
              },
            },
          }}
        />

        <main>
          <Routes>
            {/* Route publique - Login */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />

            {/* Redirection par défaut vers login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Routes protégées */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sendNotifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/variations" 
              element={
                <ProtectedRoute>
                  <Variations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/boutiques" 
              element={
                <ProtectedRoute>
                  <Boutiques />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commandes" 
              element={
                <ProtectedRoute>
                  <Commandes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/localisations" 
              element={
                <ProtectedRoute>
                  <Localisations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profil" 
              element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/finances" 
              element={
                <ProtectedRoute>
                  <Finances />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;