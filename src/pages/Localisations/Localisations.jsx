import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "./components/StatsCard";
import statData from "../../data/statData";
import useLocalisationStore from "../../stores/localisation.store";

const Localisations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCityId, setExpandedCityId] = useState(null);

  const {
    villes,
    communes,
    communesParVille,
    fetchVilles,
    fetchCommunes,
    fetchCommunesParVille,
    ajouterVilles,
    ajouterCommunes,
    loading,
    error,
  } = useLocalisationStore();

  // Chargement initial
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchVilles();
        await fetchCommunes();
      } catch (err) {
        console.error("Erreur chargement initial:", err);
      }
    };
    
    loadData();
  }, [fetchVilles, fetchCommunes]);

  const stats = statData(villes?.length || 0, communes?.length || 0);

  const toggleCityExpansion = async (cityId, cityName) => {
    if (expandedCityId === cityId) {
      setExpandedCityId(null);
      return;
    }

    setExpandedCityId(cityId);
    
    // Vérifie si nous avons déjà les communes pour cette ville
    if (!communesParVille[cityId] || communesParVille[cityId].length === 0) {
      await fetchCommunesParVille(cityName, cityId);
    }
  };

  const handleAddCommune = (cityId) => {
    const city = villes.find(v => v.hashid === cityId);
    if (city) {
      alert(`Ajouter une commune pour la ville: ${city.lib_ville}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:sticky top-0 z-40 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 w-64 h-screen bg-white shadow-md`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Fermer la sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <DashboardSidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          title="Localisations"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50 w-full space-y-6">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestion des localisations
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Gérez les villes et communes de votre plateforme
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={ajouterVilles}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter Ville</span>
              </button>
              <button
                onClick={ajouterCommunes}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter Commune</span>
              </button>
            </div>
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <StatsCard
                key={`stat-${index}`}
                title={item.title}
                value={item.value}
                icon={item.icon}
                bgColor={item.bgColor}
              />
            ))}
          </div>

          {/* Liste des villes et communes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Villes et Communes</h3>
              <p className="text-sm text-gray-500 mt-1">
                Cliquez sur une ville pour voir ses communes
              </p>
            </div>

            <div className="p-6">
              {loading && villes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Chargement en cours...</p>
                </div>
              ) : villes.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune ville ajoutée</p>
                  <p className="text-sm text-gray-400">
                    Commencez par ajouter une ville
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {villes.map((city) => {
                    const cityCommunes = communesParVille[city.hashid] || [];
                    const isExpanded = expandedCityId === city.hashid;

                    return (
                      <div
                        key={`ville-${city.hashid}`}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleCityExpansion(city.hashid, city.lib_ville)}
                                disabled={loading}
                                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-5 h-5 text-gray-600" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-600" />
                                )}
                              </button>

                              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-pink-600" />
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {city.lib_ville}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {cityCommunes.length} commune
                                  {cityCommunes.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddCommune(city.hashid)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                            >
                              + Commune
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4">
                            {loading ? (
                              <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="text-gray-500 mt-2">
                                  Chargement des communes...
                                </p>
                              </div>
                            ) : cityCommunes.length === 0 ? (
                              <div className="text-center py-8">
                                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                  Aucune commune dans cette ville
                                </p>
                                <button
                                  onClick={() => handleAddCommune(city.hashid)}
                                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  Ajouter la première commune
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {cityCommunes.map((commune) => (
                                  <div
                                    key={`commune-${commune.hashid}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <span className="font-medium text-gray-900">
                                        {commune.lib_commune}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Localisations;