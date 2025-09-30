import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Search, Filter, Store, Mail, Calendar, CreditCard, Phone } from "lucide-react";
import useBoutiqueStore from "../../stores/boutique.store";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { motion } from "framer-motion";

const Boutiques = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { boutiques, loading, error, fetchBoutiques } = useBoutiqueStore();

  useEffect(() => {
    fetchBoutiques();
  }, [fetchBoutiques]);

  const filteredBoutiques = boutiques.filter(
    (boutique) =>
      boutique.nom_btq.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boutique.email_btq.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boutique.tel_btq.includes(searchTerm)
  );

  const skeletonCount = boutiques?.length > 0 ? boutiques.length : 3;


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -6,
      boxShadow: "0 20px 40px rgba(16, 185, 129, 0.12)",
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  const LoadingSpinner = ({ size = "medium" }) => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className={`rounded-full border-t-2 border-b-2 border-emerald-500 ${
        size === "small" ? "h-6 w-6" : 
        size === "medium" ? "h-8 w-8" : 
        "h-12 w-12"
      }`}
    />
  );

  if (error)
    return (
      <motion.div 
        className="flex-1 flex items-center justify-center p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center max-w-md">
          <p className="font-semibold mb-2">Erreur de chargement</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
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
                md:translate-x-0 w-64 h-screen`}>
        <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
            aria-label="Fermer la sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          title="Boutiques"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
          {/* En-tête */}
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                Gestion des boutiques
              </h1>
              <p className="text-emerald-600/80">
                Gérez les boutiques partenaires de votre plateforme
              </p>
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-20 h-6 bg-emerald-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <motion.div 
                className="flex items-center gap-2 text-emerald-600/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">{boutiques.length} boutique{boutiques.length !== 1 ? 's' : ''}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Barre de recherche et filtres */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              {/* Barre de recherche */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-emerald-400 w-5 h-5" />
                </div>
                <motion.input
                  type="text"
                  placeholder="Rechercher une boutique par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                  whileFocus={{ scale: 1.01 }}
                  disabled={loading}
                />
              </div>

              {/* Bouton Filtres */}
              <motion.button
                className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all duration-300 whitespace-nowrap font-medium text-emerald-700"
                style={{ height: "48px" }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={loading}
              >
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Grille des boutiques */}
          {loading ? (
            // Loading state for boutiques grid
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Array(skeletonCount).fill(0).map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden"
                  variants={itemVariants}
                >
                  {/* En-tête de la carte en loading */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center rounded-xl p-3 bg-emerald-200 border border-emerald-300 animate-pulse">
                          <div className="w-6 h-6"></div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="h-6 bg-emerald-200 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-3 h-3 bg-emerald-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-emerald-200 rounded w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la carte en loading */}
                  <div className="px-6 pb-6">
                    <div className="space-y-3 mb-4">
                      {/* Email loading */}
                      <div className="flex items-center space-x-2 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="w-4 h-4 bg-emerald-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-emerald-200 rounded w-full animate-pulse"></div>
                      </div>

                      {/* Date loading */}
                      <div className="flex items-center space-x-2 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="w-4 h-4 bg-emerald-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-emerald-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Actions loading */}
                    <div className="flex gap-2 pt-4 border-t border-emerald-100">
                      <div className="flex-1 py-2 bg-emerald-200 rounded animate-pulse"></div>
                      <div className="flex-1 py-2 bg-emerald-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : filteredBoutiques.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Store className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                {searchTerm ? "Aucune boutique trouvée" : "Aucune boutique disponible"}
              </h3>
              <p className="text-emerald-600/70">
                {searchTerm 
                  ? "Essayez de modifier vos critères de recherche" 
                  : "Les boutiques apparaîtront ici une fois créées"
                }
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBoutiques.map((boutique, index) => (
                <motion.div 
                  key={boutique.hashid}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  custom={index}
                  whileHover="hover"
                >
                  {/* En-tête de la carte */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {/* Avatar avec initiale */}
                        {(() => {
                          const nom = boutique?.nom_btq?.toUpperCase() || "Boutique";
                          const initiale = nom.charAt(0);

                          return (
                            <div className="relative">
                              <motion.div 
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-semibold shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                {initiale || <Store className="w-6 h-6" />}
                              </motion.div>

                              {/* Petit badge Store */}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Store className="w-2 h-2 text-white" />
                              </div>
                            </div>
                          );
                        })()}

                        <div className="min-w-0">
                          <h3 className="font-semibold text-emerald-900 text-lg truncate">
                            {boutique.nom_btq}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <p className="text-sm text-emerald-600/80">
                              {boutique.tel_btq}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="px-6 pb-6">
                    <div className="space-y-3 mb-4">
                      {/* Email */}
                      <motion.div 
                        className="flex items-center space-x-2 text-sm text-emerald-700 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{boutique.email_btq}</span>
                      </motion.div>

                      {/* Date de création */}
                      <motion.div 
                        className="flex items-center space-x-2 text-sm text-emerald-700 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Depuis le {formatDate(boutique.created_at)}</span>
                      </motion.div>
                    </div>

                    {/* Actions */}
                    <motion.div 
                      className="flex gap-2 pt-4 border-t border-emerald-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <motion.button
                        className="flex-1 py-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Voir détails
                      </motion.button>
                      <motion.button
                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium text-sm transition-all duration-300"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Contacter
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Boutiques;