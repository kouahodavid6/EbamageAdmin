import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Tag, Calendar } from "lucide-react";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const ArticleDetailModal = ({ article, isOpen, onClose }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy à HH:mm", { locale: fr });
  };

  if (!article) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative z-[10000] bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-emerald-100"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* En-tête */}
            <div className="flex justify-between items-center p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Info className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">Détails de l'article</h2>
                  <p className="text-emerald-600 text-sm">Informations complètes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Colonne gauche - Image */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-100">
                    <img
                      src={article.image}
                      alt={article.nom_article}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Prix */}
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 text-white text-center">
                    <p className="text-sm opacity-90">Prix actuel</p>
                    <p className="text-3xl font-bold mt-1">{formatPrice(article.prix)}</p>
                    {article.old_price && (
                      <>
                        <p className="text-sm opacity-90 mt-2">Ancien prix</p>
                        <p className="text-xl line-through opacity-70">{formatPrice(article.old_price)}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Informations */}
                <div className="space-y-6">
                  {/* Nom de l'article */}
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-2">{article.nom_article}</h3>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Ajouté le {formatDate(article.created_at)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-2">Description</h4>
                    <p className="text-emerald-600 leading-relaxed bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      {article.description}
                    </p>
                  </div>

                  {/* Catégories */}
                  {article.categories?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-800 mb-3">Catégories</h4>
                      <div className="flex flex-wrap gap-2">
                        {article.categories.map((categorie, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200"
                          >
                            <Tag className="w-4 h-4" />
                            {categorie.nom_categorie}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variations */}
                  {article.variations?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-800 mb-3">Variations disponibles</h4>
                      <div className="space-y-3">
                        {article.variations.map((variation, idx) => (
                          <div key={idx} className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <p className="font-medium text-emerald-700 mb-2 capitalize">
                              {variation.nom_variation} :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {variation.lib_variation.map((lib, libIdx) => (
                                <span
                                  key={libIdx}
                                  className="px-3 py-1 bg-white text-emerald-600 rounded-lg border border-emerald-200 text-sm"
                                >
                                  {lib}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArticleDetailModal;