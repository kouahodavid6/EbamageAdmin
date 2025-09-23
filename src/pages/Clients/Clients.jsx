import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Search, Filter, Store, Mail, Calendar } from "lucide-react";
import useClientStore from "../../stores/client.store";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const Clients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading, error, fetchClients } = useClientStore();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter(
    (client) =>
      client.nom_clt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email_clt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.tel_clt.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: fr });
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        Chargement...
      </div>
    );
  if (error)
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Erreur: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 z-40 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 w-64 h-screen bg-white shadow-md`}>
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Fermer la sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <DashboardSidebar />
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          title="CLients"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">
                Gestion des clients
              </h1>
              <p className="text-gray-600 mt-1 text-xs xs:text-sm sm:text-base">
                Gérez les clients partenaires de votre plateforme
              </p>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
              {/* Barre de recherche */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Bouton Filtres - toujours aligné */}
              <button
                className="flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                style={{ height: "42px" }} // Hauteur fixe correspondant à l'input
              >
                <Filter className="w-5 h-5 flex-shrink-0" />
                <span className="hidden xs:inline">Filtres</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.hashid}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={client.image_clt}
                        alt={client.image_clt}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {client.nom_clt}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {client.tel_clt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{client.email_clt}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Client depuis le {formatDate(client.created_at)}
                      </span>
                    </div>

                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Store className="w-5 h-5 text-gray-500 mr-1" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {client.solde_tdl.toLocaleString("fr-FR")} FCFA
                      </div>
                      <div className="text-xs text-gray-500">Solde TDL</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Clients;
