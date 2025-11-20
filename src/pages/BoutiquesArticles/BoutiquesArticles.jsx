import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Search, Filter, ArrowLeft, Tag, ShoppingBag, Info } from "lucide-react";
import useBoutiqueArticleStore from "../../stores/boutiquesArticles.store";
import { motion } from "framer-motion";
import ArticleDetailModal from "./components/ArticleDetailModal";

const BoutiquesArticles = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { hashid } = useParams();
  const navigate = useNavigate();
  
  const { articles, loading, error, currentBoutique, fetchArticlesByBoutique } = useBoutiqueArticleStore();

  useEffect(() => {
    if (hashid) {
      const boutiqueData = history.state?.boutiqueData || null;
      fetchArticlesByBoutique(hashid, boutiqueData);
    }
  }, [hashid, fetchArticlesByBoutique]);

  // Récupérer toutes les catégories uniques
  const allCategories = [...new Set(articles.flatMap(article => 
    article.categories?.map(cat => cat.nom_categorie) || []
  ))];

  // Filtrer les articles
  const filteredArticles = articles.filter((article) => {
    // Filtre par recherche
    const matchesSearch = article.nom_article.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.categories?.some(cat => 
                           cat.nom_categorie.toLowerCase().includes(searchTerm.toLowerCase())
                         );

    // Filtre par prix
    const matchesPrice = priceFilter === "all" ? true :
                        priceFilter === "under-10k" ? article.prix < 10000 :
                        priceFilter === "10k-50k" ? article.prix >= 10000 && article.prix <= 50000 :
                        priceFilter === "over-50k" ? article.prix > 50000 : true;

    // Filtre par catégorie
    const matchesCategory = categoryFilter === "all" ? true :
                           article.categories?.some(cat => cat.nom_categorie === categoryFilter);

    return matchesSearch && matchesPrice && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const handleViewDetails = (article) => {
    setSelectedArticle(article);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedArticle(null);
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retour
          </button>
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
          title={`Articles - ${currentBoutique?.nom_btq || 'Boutique'}`}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
          {/* En-tête avec bouton retour */}
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-all duration-300 p-2 hover:bg-emerald-50 rounded-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Retour</span>
              </motion.button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                  {currentBoutique?.nom_btq || 'Boutique'}
                </h1>
                <p className="text-emerald-600/80">
                  Gestion des articles de la boutique
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-32 h-6 bg-emerald-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <motion.div 
                className="flex items-center gap-2 text-emerald-600/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} sur {articles.length}
                </span>
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
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Barre de recherche */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-emerald-400 w-5 h-5" />
                </div>
                <motion.input
                  type="text"
                  placeholder="Rechercher un article par nom, description ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                  whileFocus={{ scale: 1.01 }}
                  disabled={loading}
                />
              </div>

              {/* Filtre par prix */}
              <div className="flex-shrink-0">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white/50 text-emerald-700"
                  disabled={loading}
                >
                  <option value="all">Tous les prix</option>
                  <option value="under-10k">Moins de 10.000 F</option>
                  <option value="10k-50k">10.000 - 50.000 F</option>
                  <option value="over-50k">Plus de 50.000 F</option>
                </select>
              </div>

              {/* Filtre par catégorie */}
              <div className="flex-shrink-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white/50 text-emerald-700"
                  disabled={loading || allCategories.length === 0}
                >
                  <option value="all">Toutes catégories</option>
                  {allCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Bouton Reset Filtres */}
              <motion.button
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("all");
                  setCategoryFilter("all");
                }}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all duration-300 whitespace-nowrap font-medium text-emerald-700"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={loading}
              >
                <Filter className="w-5 h-5" />
                <span>Réinitialiser</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Grille des articles */}
          {loading ? (
            // Squelette de chargement amélioré
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden"
                  variants={itemVariants}
                >
                  {/* Image loading */}
                  <div className="h-48 bg-gradient-to-r from-emerald-200 to-green-200 animate-pulse"></div>
                  
                  <div className="p-6">
                    {/* Titre loading */}
                    <div className="h-6 bg-emerald-200 rounded w-3/4 mb-4 animate-pulse"></div>
                    
                    {/* Prix loading */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-7 bg-emerald-300 rounded w-1/3 animate-pulse"></div>
                      <div className="h-5 bg-emerald-200 rounded w-1/4 animate-pulse"></div>
                    </div>

                    {/* Catégories loading */}
                    <div className="flex gap-2 mb-6">
                      <div className="h-6 bg-emerald-200 rounded w-16 animate-pulse"></div>
                      <div className="h-6 bg-emerald-200 rounded w-20 animate-pulse"></div>
                    </div>

                    {/* Actions loading */}
                    <div className="flex gap-3 pt-4 border-t border-emerald-100">
                      <div className="flex-1 py-3 bg-emerald-200 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : filteredArticles.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                {searchTerm || priceFilter !== "all" || categoryFilter !== "all" 
                  ? "Aucun article trouvé" 
                  : "Aucun article disponible"
                }
              </h3>
              <p className="text-emerald-600/70 mb-4">
                {searchTerm || priceFilter !== "all" || categoryFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche ou de filtres" 
                  : "Les articles apparaîtront ici une fois créés"
                }
              </p>
              {(searchTerm || priceFilter !== "all" || categoryFilter !== "all") && (
                <motion.button
                  onClick={() => {
                    setSearchTerm("");
                    setPriceFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Réinitialiser les filtres
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredArticles.map((article, index) => (
                <motion.div 
                  key={article.hashid}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  custom={index}
                  whileHover="hover"
                >
                  {/* Image de l'article */}
                  <div className="h-48 bg-emerald-100 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.nom_article}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-6">
                    {/* En-tête avec nom et prix */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-emerald-900 text-lg flex-1 pr-2 line-clamp-2">
                        {article.nom_article}
                      </h3>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-emerald-600">
                          {formatPrice(article.prix)}
                        </p>
                        {article.old_price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(article.old_price)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Catégories */}
                    {article.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.categories.map((categorie, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full border border-emerald-200"
                          >
                            <Tag className="w-3 h-3" />
                            {categorie.nom_categorie}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bouton Voir détails */}
                    <motion.button
                      onClick={() => handleViewDetails(article)}
                      className="w-full py-3 bg-emerald-600 text-white font-medium text-sm transition-all duration-300 hover:bg-emerald-700 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-2"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Info className="w-4 h-4" />
                      <span>Voir détails</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal de détails */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BoutiquesArticles;