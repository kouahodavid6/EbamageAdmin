import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, ChevronDown, X, Edit, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "./components/StatsCard";
import statData from "../../data/statData";
import useLocalisationStore from "../../stores/localisation.store";
import { motion, AnimatePresence } from "framer-motion";
import ModalVille from "./components/ModalVille";
import ModalCommune from "./components/ModalCommune";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const Localisations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCityId, setExpandedCityId] = useState(null);
  
  // États pour les modaux
  const [villeModalOpen, setVilleModalOpen] = useState(false);
  const [communeModalOpen, setCommuneModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // États pour les éléments sélectionnés
  const [selectedVille, setSelectedVille] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [actionType, setActionType] = useState(""); // "delete_ville", "delete_commune"

  const {
    villes,
    communes,
    communesParVille,
    fetchVilles,
    fetchCommunes,
    fetchCommunesParVille,
    ajouterVille,
    modifierVille,
    supprimerVille,
    ajouterCommune,
    modifierCommune,
    supprimerCommune,
    loading,
    error,
    clearError,
    getCommunesByVilleId
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

  const toggleCityExpansion = async (cityId) => {
    if (expandedCityId === cityId) {
      setExpandedCityId(null);
      return;
    }

    setExpandedCityId(cityId);
    
    const existingCommunes = getCommunesByVilleId(cityId);
    if (!existingCommunes || existingCommunes.length === 0) {
      await fetchCommunesParVille(cityId);
    }
  };

  // Gestion des actions
  const handleAjouterVille = async (lib_ville) => {
    try {
      const result = await ajouterVille(lib_ville);
      if (result.success) {
        toast.success(`Ville "${lib_ville}" ajoutée avec succès`);
      }
      setVilleModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la ville:", err);
    }
  };

  const handleModifierVille = async (hashid, lib_ville) => {
    try {
      const result = await modifierVille(hashid, lib_ville);
      if (result.success) {
        toast.success(`Ville "${lib_ville}" modifiée avec succès`);
      }
      setVilleModalOpen(false);
      setSelectedVille(null);
    } catch (err) {
      console.error("Erreur lors de la modification de la ville:", err);
    }
  };

  const handleSupprimerVille = async () => {
    if (!selectedVille) return;
    try {
      const result = await supprimerVille(selectedVille.hashid);
      if (result.success) {
        toast.success(`Ville "${selectedVille.lib_ville}" supprimée avec succès`);
      } else {
        toast.warning(result.message || "Impossible de supprimer cette ville");
      }
      setDeleteModalOpen(false);
      setSelectedVille(null);
      setActionType("");
    } catch (err) {
      console.error("Erreur lors de la suppression de la ville:", err);
    }
  };

  const handleAjouterCommune = async (lib_commune, id_ville_hash) => {
    try {
      const result = await ajouterCommune(lib_commune, id_ville_hash);
      if (result.success) {
        toast.success(`Commune "${lib_commune}" ajoutée avec succès`);
      }
      setCommuneModalOpen(false);
      setSelectedVille(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la commune:", err);
    }
  };

  const handleModifierCommune = async (hashid, lib_commune, id_ville_hash) => {
    try {
      const result = await modifierCommune(hashid, lib_commune, id_ville_hash);
      if (result.success) {
        toast.success(`Commune "${lib_commune}" modifiée avec succès`);
      }
      setCommuneModalOpen(false);
      setSelectedCommune(null);
    } catch (err) {
      console.error("Erreur lors de la modification de la commune:", err);
    }
  };

  const handleSupprimerCommune = async () => {
    if (!selectedCommune) return;
    try {
      const result = await supprimerCommune(selectedCommune.hashid);
      if (result.success) {
        toast.success(`Commune "${selectedCommune.lib_commune}" supprimée avec succès`);
      }
      setDeleteModalOpen(false);
      setSelectedCommune(null);
      setActionType("");
    } catch (err) {
      console.error("Erreur lors de la suppression de la commune:", err);
    }
  };

  // Ouvrir modaux
  const openAjouterVilleModal = () => {
    setSelectedVille(null);
    setVilleModalOpen(true);
  };

  const openModifierVilleModal = (ville) => {
    setSelectedVille(ville);
    setVilleModalOpen(true);
  };

  const openSupprimerVilleModal = (ville) => {
    setSelectedVille(ville);
    setActionType("delete_ville");
    setDeleteModalOpen(true);
  };

  const openAjouterCommuneModal = (ville) => {
    setSelectedVille(ville);
    setSelectedCommune(null);
    setCommuneModalOpen(true);
  };

  const openModifierCommuneModal = (commune) => {
    setSelectedCommune(commune);
    setSelectedVille(null);
    setCommuneModalOpen(true);
  };

  const openSupprimerCommuneModal = (commune) => {
    setSelectedCommune(commune);
    setActionType("delete_commune");
    setDeleteModalOpen(true);
  };

  // Fermer le modal de suppression
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedVille(null);
    setSelectedCommune(null);
    setActionType("");
  };

  // Obtenir le nom de l'entité pour le modal de suppression
  const getEntityName = () => {
    if (actionType === "delete_ville" && selectedVille) {
      return `la ville "${selectedVille.lib_ville}"`;
    }
    if (actionType === "delete_commune" && selectedCommune) {
      return `la commune "${selectedCommune.lib_commune}"`;
    }
    return "cet élément";
  };

  // Fonction de confirmation de suppression
  const handleConfirmDelete = () => {
    if (actionType === "delete_ville") {
      handleSupprimerVille();
    } else if (actionType === "delete_commune") {
      handleSupprimerCommune();
    }
  };

  // Squelettes
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-emerald-200 rounded animate-pulse w-1/2"></div>
              <div className="h-8 bg-emerald-300 rounded animate-pulse w-3/4"></div>
            </div>
            <div className="w-12 h-12 bg-emerald-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const CitySkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-200 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-emerald-300 rounded animate-pulse w-32"></div>
                  <div className="h-4 bg-emerald-200 rounded animate-pulse w-24"></div>
                </div>
              </div>
              <div className="h-8 bg-emerald-200 rounded-lg animate-pulse w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CommuneSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-200 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-emerald-300 rounded animate-pulse w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50/20 flex flex-col md:flex-row">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 w-64 h-screen`}
      >
        <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
            aria-label="Fermer la sidebar"
          >
            <X className="w-5 h-5" />
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

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
          {/* En-tête */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2 text-left">
                Gestion des localisations
              </h1>
              <p className="text-emerald-600/80 text-left">
                Gérez les villes et communes de votre plateforme
              </p>
            </div>

            <div className="flex w-full flex-col sm:flex-row gap-3 sm:gap-4 sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto md:mx-0">
              <motion.button
                onClick={openAjouterVilleModal}
                disabled={loading}
                className="bg-gradient-to-r w-full from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Ajouter Ville</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Affichage des erreurs globales */}
          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex justify-between items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="font-medium">{error}</p>
              <button 
                onClick={clearError}
                className="text-red-700 hover:text-red-900 ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Statistiques */}
          {loading && villes.length === 0 ? (
            <StatsSkeleton />
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {stats.map((item, index) => (
                <StatsCard
                  key={`stat-${index}`}
                  title={item.title}
                  value={item.value}
                  icon={item.icon}
                  bgColor={item.bgColor}
                />
              ))}
            </motion.div>
          )}

          {/* Liste des villes et communes */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="p-6 border-b border-emerald-100/60">
              <h3 className="text-xl font-semibold text-emerald-900">Villes et Communes</h3>
              <p className="text-emerald-600/80 text-sm mt-1">
                Cliquez sur une ville pour voir ses communes
              </p>
            </div>

            <div className="p-6">
              {loading && villes.length === 0 ? (
                <CitySkeleton />
              ) : villes.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Building2 className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-emerald-900 mb-2">Aucune ville ajoutée</h4>
                  <p className="text-emerald-600/70">
                    Commencez par ajouter une ville
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {villes.map((city) => {
                    const cityCommunes = communesParVille[city.hashid] || [];
                    const isExpanded = expandedCityId === city.hashid;

                    return (
                      <motion.div
                        key={`ville-${city.hashid}`}
                        className="bg-white rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* En-tête de la ville */}
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Partie gauche : icône + infos */}
                            <div className="flex items-center space-x-4">
                              <motion.button
                                onClick={() => toggleCityExpansion(city.hashid)}
                                disabled={loading}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 disabled:opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                              </motion.button>

                              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                              </div>

                              <div>
                                <h4 className="font-semibold text-emerald-900 text-base sm:text-lg">
                                  {city.lib_ville}
                                </h4>
                                <p className="text-emerald-600/80 text-sm sm:text-base">
                                  {cityCommunes.length} commune{cityCommunes.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>

                            {/* Actions ville */}
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => openModifierVilleModal(city)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Modifier la ville"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              
                              <motion.button
                                onClick={() => openSupprimerVilleModal(city)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Supprimer la ville"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>

                              <motion.button
                                onClick={() => openAjouterCommuneModal(city)}
                                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-teal-500/25"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                + Commune
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Communes */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 pb-6"
                            >
                              {loading ? (
                                <CommuneSkeleton />
                              ) : cityCommunes.length === 0 ? (
                                <motion.div 
                                  className="text-center py-8"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <MapPin className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                                  <p className="text-emerald-600/80 text-sm mb-3">
                                    Aucune commune dans cette ville
                                  </p>
                                  <motion.button
                                    onClick={() => openAjouterCommuneModal(city)}
                                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Ajouter la première commune
                                  </motion.button>
                                </motion.div>
                              ) : (
                                <motion.div 
                                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {cityCommunes.map((commune) => (
                                    <motion.div
                                      key={`commune-${commune.hashid}`}
                                      className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-emerald-50 hover:shadow-md transition-all duration-300 group"
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                                          <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-medium text-emerald-900">
                                          {commune.lib_commune}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <motion.button
                                          onClick={() => openModifierCommuneModal(commune)}
                                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          title="Modifier la commune"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </motion.button>
                                        
                                        <motion.button
                                          onClick={() => openSupprimerCommuneModal(commune)}
                                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          title="Supprimer la commune"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modaux */}
      <ModalVille
        isOpen={villeModalOpen}
        onClose={() => {
          setVilleModalOpen(false);
          setSelectedVille(null);
        }}
        onSubmit={selectedVille ? handleModifierVille : handleAjouterVille}
        ville={selectedVille} // null pour ajout, objet ville pour modification
        loading={loading}
        error={error}
      />

      <ModalCommune
        isOpen={communeModalOpen}
        onClose={() => {
          setCommuneModalOpen(false);
          setSelectedVille(null);
          setSelectedCommune(null);
        }}
        onSubmit={selectedCommune ? handleModifierCommune : handleAjouterCommune}
        commune={selectedCommune} // null pour ajout, objet commune pour modification
        selectedVille={selectedVille} // pour l'ajout avec ville présélectionnée
        villes={villes}
        loading={loading}
        error={error}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        entityName={getEntityName()}
        isDeleting={loading}
      />
    </div>
  );
};

export default Localisations;