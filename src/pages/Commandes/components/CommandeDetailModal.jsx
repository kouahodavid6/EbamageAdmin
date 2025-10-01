import {
  Package,
  User,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  X,
  Calendar,
  ShoppingBag,
  Store,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { motion, AnimatePresence } from "framer-motion";

const CommandeDetailModal = ({ commande, onClose }) => {
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    
    switch (status) {
      case "En attente":
        return (
          <span className={`bg-amber-100 text-amber-800 ${baseClasses}`}>
            <Clock className="w-3 h-3" /> {status}
          </span>
        );
      case "Validée":
        return (
          <span className={`bg-emerald-100 text-emerald-800 ${baseClasses}`}>
            <CheckCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "Annulée":
        return (
          <span className={`bg-red-100 text-red-800 ${baseClasses}`}>
            <XCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "En livraison":
        return (
          <span className={`bg-blue-100 text-blue-800 ${baseClasses}`}>
            <Truck className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className={`bg-gray-100 text-gray-800 ${baseClasses}`}>
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy HH:mm", { locale: fr });
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!commande) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
      >
        <motion.div 
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100/20"
          variants={modalVariants}
        >
          <div className="p-8">
            {/* En-tête */}
            <div className="flex justify-between items-start mb-8 border-b border-emerald-100 pb-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShoppingBag className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                    Détails de la commande
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200">
                      #{commande.hashid.substring(0, 8).toUpperCase()}
                    </span>
                    <span className="text-emerald-600 text-sm flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <Calendar className="w-4 h-4" />
                      {formatDate(commande.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl text-emerald-500 hover:text-emerald-700 transition-all duration-200 border border-emerald-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                {/* Client */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    Informations client
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">Nom complet</p>
                        <p className="text-emerald-900 font-medium">{commande.client.nom_clt}</p>
                      </div>
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">Email</p>
                        <p className="text-emerald-900">{commande.client.email_clt}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">ID Client</p>
                        <p className="text-emerald-900 font-mono text-sm">{commande.client.hashid_clt}</p>
                      </div>
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">Téléphone</p>
                        <p className="text-emerald-900 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {commande.client.tel_clt}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Articles */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    Articles commandés ({commande.articles.length})
                  </h3>
                  <div className="space-y-4">
                    {commande.articles.map((article, index) => (
                      <motion.div
                        key={article.hashid}
                        className="flex gap-4 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 hover:bg-emerald-50/50 transition-all duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                      >
                        <img
                          src={article.image || "https://via.placeholder.com/100/ecfdf5/10b981?text=Image"}
                          alt={article.nom_article}
                          className="w-24 h-24 rounded-xl object-cover shadow-md border border-emerald-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-emerald-900 text-lg mb-2">
                            {article.nom_article}
                          </h4>
                          <p className="text-emerald-600/80 text-sm line-clamp-2 mb-3">
                            {article.description}
                          </p>
                          
                          {/* Prix et quantité */}
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-lg font-bold text-emerald-700">
                              {article.prix.toLocaleString("fr-FR")} FCFA
                            </span>
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-medium">
                              Quantité: {article.quantite}
                            </span>
                            <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-lg text-sm font-medium">
                              Total: {(article.prix * article.quantite).toLocaleString("fr-FR")} FCFA
                            </span>
                          </div>

                          {/* Variations */}
                          {article.variations?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-emerald-600/70 text-xs font-medium mb-2">Variations:</p>
                              <div className="flex flex-wrap gap-2">
                                {article.variations.map((variation, i) => (
                                  <span
                                    key={i}
                                    className="inline-block bg-white rounded-lg px-3 py-1.5 text-sm text-emerald-700 border border-emerald-200 shadow-sm"
                                  >
                                    <span className="font-medium">{variation.nom_variation}:</span> {variation.lib_variation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Boutique */}
                          <div className="bg-white rounded-lg p-3 border border-emerald-200">
                            <div className="flex items-center gap-3 mb-2">
                              <Store className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-700 font-medium">Boutique</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-emerald-600/70 text-xs">Nom</p>
                                <p className="text-emerald-900 font-medium">{article.boutique.nom_btq}</p>
                              </div>
                              <div>
                                <p className="text-emerald-600/70 text-xs">Contact</p>
                                <p className="text-emerald-900 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {article.boutique.tel_btq}
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-emerald-600/70 text-xs">Email</p>
                                <p className="text-emerald-900 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {article.boutique.email_btq}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                {/* Résumé */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Résumé financier</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="text-emerald-600">Sous-total articles</span>
                      <span className="font-medium text-emerald-900">
                        {commande.prix_total_articles.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="text-emerald-600">Frais de livraison</span>
                      <span className="font-medium text-emerald-900">
                        {commande.livraison.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-emerald-200">
                      <span className="text-emerald-900 font-semibold text-base">Total général</span>
                      <span className="text-emerald-700 font-bold text-xl">
                        {commande.prix_total_commande.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Statut */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Statut de la commande</h3>
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusBadge(commande.statut)}
                  </div>
                  <p className="text-emerald-600/80 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Commandé le {formatDate(commande.created_at)}
                  </p>
                </motion.div>

                {/* Paiement */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    Paiement
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Moyen de paiement</p>
                      <p className="text-emerald-900 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        {commande.moyen_de_paiement}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Livraison */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    Adresse de livraison
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Ville</p>
                      <p className="text-emerald-900">{commande.localisation.ville}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Commune</p>
                      <p className="text-emerald-900">{commande.localisation.commune}</p>
                    </div>
                    {commande.localisation.quartier && (
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">Quartier</p>
                        <p className="text-emerald-900">{commande.localisation.quartier}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandeDetailModal;