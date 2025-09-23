import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import Categories from './pages/Catégoties/categories';
import Variations from './pages/Variations/Variations';
import Boutiques from './pages/Boutiques/Boutiques';
import Clients from './pages/Clients/Clients';
import Commandes from './pages/Commandes/Commandes';
import Localisations from './pages/Localisations/Localisations';

function App() {
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
            {/* Accès direct sans authentification */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/variations" element={<Variations />} />
            <Route path="/boutiques" element={<Boutiques />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/localisations" element={<Localisations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;