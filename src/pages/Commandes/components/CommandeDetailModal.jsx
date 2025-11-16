// src/components/modals/CommandeDetailModal.jsx
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
  Check,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { motion, AnimatePresence } from "framer-motion";
import useCommandeStore from "../../../stores/commande.store";
import { useState, useEffect } from "react";

const CommandeDetailModal = ({ commande, onClose }) => {
  const {
    annulerCommande,
    livrerCommande,
    confirmerCommande,
    changerStatutSousCommande,
    toastMessage,
    clearToast
  } = useCommandeStore();

  const [loadingAction, setLoadingAction] = useState(null);
  const [clickedButtons, setClickedButtons] = useState(new Set());

  // Fermer modal automatiquement quand toastMessage est défini (500ms)
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
        clearToast();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, onClose, clearToast]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return format(d, "dd MMM yyyy HH:mm", { locale: fr });
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status) {
      case "En attente":
        return <span className={`bg-amber-100 text-amber-800 ${base}`}><Clock className="w-3 h-3" /> {status}</span>;
      case "Confirmée":
        return <span className={`bg-emerald-100 text-emerald-800 ${base}`}><CheckCircle className="w-3 h-3" /> {status}</span>;
      case "Annulée":
        return <span className={`bg-red-100 text-red-800 ${base}`}><XCircle className="w-3 h-3" /> {status}</span>;
      case "En livraison":
        return <span className={`bg-blue-100 text-blue-800 ${base}`}><Truck className="w-3 h-3" /> {status}</span>;
      case "Livrée":
        return <span className={`bg-green-100 text-green-800 ${base}`}><CheckCircle className="w-3 h-3" /> {status}</span>;
      default:
        return <span className={`bg-gray-100 text-gray-800 ${base}`}>{status}</span>;
    }
  };

  if (!commande) return null;

  const toutesSousCommandesAvecStatut = (statut) => {
    if (!Array.isArray(commande?.articles) || commande.articles.length === 0) return false;
    return commande.articles.every(a => a?.statut_sous_commande === statut);
  };

  const handleChangerStatutSousCommande = async (hashidCommande, hashidArticle, statut, libVariation = null) => {
    const key = `sous-commande-${hashidArticle}-${statut}`;
    setLoadingAction(key);
    setClickedButtons(prev => new Set(prev).add(key));
    try {
      await changerStatutSousCommande(hashidCommande, hashidArticle, statut, libVariation, () => {});
    } catch (err) {
      // erreur gérée dans le store
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAction = async (action, hashid) => {
    setLoadingAction(action);
    try {
      switch (action) {
        case "confirmer":
          await confirmerCommande(hashid, () => {});
          break;
        case "livrer":
          await livrerCommande(hashid, () => {});
          break;
        case "annuler":
          await annulerCommande(hashid, () => {});
          break;
        default:
          break;
      }
    } catch (err) {
      // erreur gérée dans le store
    } finally {
      setLoadingAction(null);
    }
  };

  const isSousCommandeActionDisabled = (actionType, article, targetStatut) => {
    if (!article) return true;
    if (loadingAction) return true;
    if (commande?.statut === "Annulée") return true;

    const key = `sous-commande-${article.hashid}-${targetStatut}`;
    if (clickedButtons.has(key)) return true;

    const current = article?.statut_sous_commande ?? "En attente";
    switch (actionType) {
      case "confirmer":
        return current !== "En attente";
      case "livrer":
        return current !== "Confirmée";
      default:
        return false;
    }
  };

  const isCommandeActionDisabled = (actionType) => {
    if (loadingAction) return true;
    if (commande?.statut === "Annulée") return true;

    // Si toutes les sous-commandes sont livrées, la commande est considérée comme livrée
    const commandeEstLivree = commande?.statut === "Livrée" || toutesSousCommandesAvecStatut("Livrée");

    switch (actionType) {
      case "confirmer":
        return commande?.statut === "Confirmée" || commandeEstLivree || toutesSousCommandesAvecStatut("Confirmée");
      case "livrer":
        return commande?.statut === "Livrée" || commandeEstLivree || !toutesSousCommandesAvecStatut("Confirmée");
      case "annuler":
        // Griser le bouton annuler si la commande est livrée (toutes les sous-commandes sont livrées)
        return commande?.statut === "Annulée" || commandeEstLivree;
      default:
        return false;
    }
  };

  const getCommandeButtonText = (actionType) => {
    const commandeEstLivree = commande?.statut === "Livrée" || toutesSousCommandesAvecStatut("Livrée");
    
    switch (actionType) {
      case "confirmer":
        return commande?.statut === "Confirmée" || toutesSousCommandesAvecStatut("Confirmée") ? "Confirmée" : "Confirmer la commande";
      case "livrer":
        return commandeEstLivree ? "Livrée" : "Marquer comme livrée";
      case "annuler":
        return commande?.statut === "Annulée" ? "Annulée" : "Annuler la commande";
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" initial="hidden" animate="visible" exit="hidden">
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={onClose}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100/20 relative z-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8 border-b border-emerald-100 pb-4 sm:pb-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div
                    className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 sm:p-3 rounded-lg shadow-lg flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <h2 className="text-sm sm:text-2xl font-bold text-emerald-900 flex-1 min-w-0">Détails de la commande</h2>
                </div>

                <motion.button
                  onClick={onClose}
                  className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg text-emerald-500 hover:text-emerald-700 transition-all duration-200 border border-emerald-200 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              <div className="flex-1 min-w-0 flex flex-wrap gap-2 sm:gap-3">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200 inline-flex items-center gap-2 max-w-full truncate">
                  #{(commande?.hashid ?? "").substring(0, 8).toUpperCase()}
                </span>

                <span className="bg-emerald-50/50 text-emerald-600 px-3 py-1.5 rounded-full text-sm inline-flex items-center gap-2 border border-emerald-100 max-w-full truncate">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  {formatDate(commande?.created_at)}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* Client Info */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
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
                        <p className="text-emerald-900 font-medium">{commande?.client?.nom_clt ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">Email</p>
                        <p className="text-emerald-900 font-medium">{commande?.client?.email_clt ?? "-"}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Téléphone</p>
                      <p className="text-emerald-900 font-medium">{commande?.client?.tel_clt ?? "-"}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Articles */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-emerald-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    Articles commandés ({commande?.articles?.length ?? 0})
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {commande?.articles?.map((article, idx) => (
                      <motion.div
                        key={article?.hashid ?? idx}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-emerald-50/30 rounded-lg sm:rounded-xl border border-emerald-100 hover:bg-emerald-50/50 transition-all duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        {/* Image */}
                        <div className="flex justify-center sm:justify-start">
                          <img
                            src={article?.image ?? "https://via.placeholder.com/100/ecfdf5/10b981?text=Image"}
                            alt={article?.nom_article ?? "-"}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-cover shadow-md border border-emerald-200 flex-shrink-0"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-emerald-900 text-base sm:text-lg text-center sm:text-left">{article?.nom_article ?? "-"}</h4>
                            <div className="flex justify-center sm:justify-start">{getStatusBadge(article?.statut_sous_commande ?? "En attente")}</div>
                          </div>

                          <p className="text-emerald-600/80 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 text-center sm:text-left">{article?.description ?? "-"}</p>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                            <span className="text-base sm:text-lg font-bold text-emerald-700 text-center sm:text-left">{(article?.prix ?? 0).toLocaleString("fr-FR")} FCFA</span>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                              <span className="bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">Quantité: {article?.quantite ?? 0}</span>
                              <span className="bg-cyan-100 text-cyan-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">Total: {((article?.prix ?? 0) * (article?.quantite ?? 0)).toLocaleString("fr-FR")} FCFA</span>
                            </div>
                          </div>

                          {article?.variations?.length > 0 && (
                            <div className="mb-2 sm:mb-3">
                              <p className="text-emerald-600/70 text-xs font-medium mb-1 sm:mb-2 text-center sm:text-left">Variations:</p>
                              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
                                {article.variations.map((v, i) => (
                                  <span key={i} className="inline-block bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-emerald-700 border border-emerald-200 shadow-sm">
                                    <span className="font-medium">{v.nom_variation}:</span> {v.lib_variation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Boutons sous-commande */}
                          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <motion.button
                              onClick={() => handleChangerStatutSousCommande(commande?.hashid, article?.hashid, "Confirmée", article?.variations?.[0]?.lib_variation)}
                              disabled={isSousCommandeActionDisabled("confirmer", article, "Confirmée")}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${isSousCommandeActionDisabled("confirmer", article, "Confirmée") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                              whileHover={!isSousCommandeActionDisabled("confirmer", article, "Confirmée") ? { scale: 1.05 } : {}}
                              whileTap={!isSousCommandeActionDisabled("confirmer", article, "Confirmée") ? { scale: 0.95 } : {}}
                            >
                              {loadingAction === `sous-commande-${article?.hashid}-Confirmée` ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                              {article?.statut_sous_commande === "Confirmée" ? "Confirmée" : "Confirmer"}
                            </motion.button>

                            <motion.button
                              onClick={() => handleChangerStatutSousCommande(commande?.hashid, article?.hashid, "Livrée", article?.variations?.[0]?.lib_variation)}
                              disabled={isSousCommandeActionDisabled("livrer", article, "Livrée")}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${isSousCommandeActionDisabled("livrer", article, "Livrée") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                              whileHover={!isSousCommandeActionDisabled("livrer", article, "Livrée") ? { scale: 1.05 } : {}}
                              whileTap={!isSousCommandeActionDisabled("livrer", article, "Livrée") ? { scale: 0.95 } : {}}
                            >
                              {loadingAction === `sous-commande-${article?.hashid}-Livrée` ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Truck className="w-4 h-4" />}
                              {article?.statut_sous_commande === "Livrée" ? "Livrée" : "Livrer"}
                            </motion.button>
                          </div>

                          {/* Boutique */}
                          <div className="bg-white rounded-lg p-2 sm:p-3 border border-emerald-200 mt-3">
                            <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2 text-sm"><Store className="w-4 h-4 text-emerald-600" /> Boutique: {article?.boutique?.nom_btq ?? "-"}</h3>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Actions principale */}
                <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Actions</h3>
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handleAction("confirmer", commande?.hashid)}
                      disabled={isCommandeActionDisabled("confirmer") || loadingAction === "confirmer"}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isCommandeActionDisabled("confirmer") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                      whileHover={!isCommandeActionDisabled("confirmer") ? { scale: 1.02 } : {}}
                      whileTap={!isCommandeActionDisabled("confirmer") ? { scale: 0.98 } : {}}
                    >
                      {loadingAction === "confirmer" ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      {getCommandeButtonText("confirmer")}
                    </motion.button>

                    <motion.button
                      onClick={() => handleAction("livrer", commande?.hashid)}
                      disabled={isCommandeActionDisabled("livrer") || loadingAction === "livrer"}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isCommandeActionDisabled("livrer") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      whileHover={!isCommandeActionDisabled("livrer") ? { scale: 1.02 } : {}}
                      whileTap={!isCommandeActionDisabled("livrer") ? { scale: 0.98 } : {}}
                    >
                      {loadingAction === "livrer" ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Truck className="w-5 h-5" />}
                      {getCommandeButtonText("livrer")}
                    </motion.button>

                    <motion.button
                      onClick={() => handleAction("annuler", commande?.hashid)}
                      disabled={isCommandeActionDisabled("annuler") || loadingAction === "annuler"}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isCommandeActionDisabled("annuler") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
                      whileHover={!isCommandeActionDisabled("annuler") ? { scale: 1.02 } : {}}
                      whileTap={!isCommandeActionDisabled("annuler") ? { scale: 0.98 } : {}}
                    >
                      {loadingAction === "annuler" ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Ban className="w-5 h-5" />}
                      {getCommandeButtonText("annuler")}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Résumé financier */}
                <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Résumé financier</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="text-emerald-600">Sous-total articles</span>
                      <span className="font-medium text-emerald-900">{(commande?.prix_total_articles ?? 0).toLocaleString("fr-FR")} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="text-emerald-600">Frais de livraison</span>
                      <span className="font-medium text-emerald-900">{(commande?.livraison ?? 0).toLocaleString("fr-FR")} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-emerald-200">
                      <span className="text-emerald-900 font-semibold text-base">Total général</span>
                      <span className="text-emerald-700 font-bold text-xl">{(commande?.prix_total_commande ?? 0).toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  </div>
                </motion.div>

                {/* Statut commande */}
                <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Statut de la commande</h3>
                  <div className="flex items-center gap-3 mb-3">{getStatusBadge(commande?.statut ?? "En attente")}</div>
                  <p className="text-emerald-600/80 text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Commandé le {formatDate(commande?.created_at)}</p>
                </motion.div>

                {/* Paiement */}
                <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div> Paiement
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Moyen de paiement</p>
                      <p className="text-emerald-900 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">{commande?.moyen_de_paiement ?? "-"}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Adresse livraison */}
                <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60 hover:shadow-xl transition-all duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-emerald-100 rounded-lg"><MapPin className="w-5 h-5 text-emerald-600" /></div> Adresse de livraison
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Ville</p>
                      <p className="text-emerald-900">{commande?.localisation?.ville ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600/70 text-xs font-medium mb-1">Commune</p>
                      <p className="text-emerald-900">{commande?.localisation?.commune ?? "-"}</p>
                    </div>
                    {commande?.localisation?.quartier && (
                      <div>
                        <p className="text-emerald-600/70 text-xs font-medium mb-1">Quartier</p>
                        <p className="text-emerald-900">{commande?.localisation?.quartier}</p>
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