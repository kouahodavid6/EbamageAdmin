import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import RecentBoutiques from "./components/RecentBoutiques";
import RecentClients from "./components/RecentClients";
import ModifierPrixModal from "./components/ModifierPrixModal";
import {
  Calendar,
  Bell,
  BadgeCent,
  Wallet,
  Image,
  Upload,
  X,
  Trash2,
} from "lucide-react";
import useCommandeStore from "../../stores/commande.store";
import useBoutiqueStore from "../../stores/boutique.store";
import useClientStore from "../../stores/client.store";
import useCategorieStore from "../../stores/categorie.store";
import usePubliciteStore from "../../stores/publicites.store";
import useLivraisonStore from "../../stores/livraison.store";
import useNotificationStore from "../../stores/notifications.store";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState({
    stats: true,
    boutiques: true,
    clients: true,
    livraison: true
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [modalOpen, setModalOpen] = useState({
    prix: false,
    seuil: false
  });

  // Stores
  const { commandes = [], fetchCommandes } = useCommandeStore();
  const { boutiques = [], fetchBoutiques } = useBoutiqueStore();
  const { clients = [], fetchClients } = useClientStore();
  const { fetchCategories } = useCategorieStore();
  const { 
    sendToClients, 
    loading: publiciteLoading, 
    error: publiciteError, 
    success: publiciteSuccess, 
    clearState 
  } = usePubliciteStore();

  const { 
    prixLivraison, 
    seuilLivraisonGratuite, 
    fetchPrixLivraison, 
    fetchSeuilLivraison, 
    updatePrixLivraison, 
    updateSeuilLivraison,
    loading: livraisonLoading,
    error: livraisonError 
  } = useLivraisonStore();

  // Store des notifications
  const { updateUnreadCount } = useNotificationStore();

  // Formatage de date - AJOUTÉ
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading({
          stats: true,
          boutiques: true,
          clients: true,
          livraison: true
        });

        await Promise.all([
          fetchCommandes(),
          fetchBoutiques(),
          fetchClients(),
          fetchCategories(),
          fetchPrixLivraison(),
          fetchSeuilLivraison(),
        ]);

        setLoading({
          stats: false,
          boutiques: false,
          clients: false,
          livraison: false
        });
      } catch (error) {
        console.error("Erreur chargement données:", error);
        toast.error("Erreur lors du chargement des données");
        setLoading({
          stats: false,
          boutiques: false,
          clients: false,
          livraison: false
        });
      }
    };

    loadData();
  }, [fetchCommandes, fetchBoutiques, fetchClients, fetchCategories, fetchPrixLivraison, fetchSeuilLivraison]);

  // Mettre à jour le compteur de notifications
  useEffect(() => {
    if (commandes.length > 0) {
      updateUnreadCount(commandes);
    }
  }, [commandes, updateUnreadCount]);

  // Gestion des toasts
  useEffect(() => {
    if (publiciteSuccess) {
      toast.success('Publicité envoyée avec succès !');
      clearState();
      clearImage();
    }
    if (publiciteError) {
      toast.error(publiciteError);
      clearState();
    }
    if (livraisonError) {
      toast.error(livraisonError);
    }
  }, [publiciteSuccess, publiciteError, livraisonError, clearState]);

  // Fonctions pour les modales
  const openModal = (type) => {
    setModalOpen(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModalOpen(prev => ({ ...prev, [type]: false }));
  };

  const handleModifierPrix = async (nouveauPrix) => {
    try {
      await updatePrixLivraison(nouveauPrix);
      toast.success('Prix de livraison modifié avec succès !');
    } catch (error) {
      // L'erreur est déjà gérée par le store
    }
  };

  const handleModifierSeuil = async (nouveauSeuil) => {
    try {
      await updateSeuilLivraison(nouveauSeuil);
      toast.success('Seuil de livraison gratuite modifié avec succès !');
    } catch (error) {
      // L'erreur est déjà gérée par le store
    }
  };

  // Gestion des images
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image dépasse la taille maximale de 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview({
        url: e.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);

    clearState();
    event.target.value = '';
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSendPublicite = async () => {
    if (!selectedImage) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('images', selectedImage);
      await sendToClients(formData);
    } catch (error) {
      console.error('Erreur envoi publicité:', error);
    }
  };

  // Variants d'animation
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
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  // Configuration des cartes d'actions
  const actionsPages = () => {
    return [
      {
        title: "Envoyer des notifications",
        icon: Bell,
        path: '/sendNotifications',
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
        isLink: true
      },
      {
        title: "Prix de livraison",
        icon: BadgeCent,
        onClick: () => openModal('prix'),
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
        valeur: prixLivraison ? `${prixLivraison.toLocaleString("fr-FR")} FCFA` : "Chargement...",
        description: "Modifier le prix",
        isLink: false
      },
      {
        title: "Seuil livraison gratuite",
        icon: BadgeCent,
        onClick: () => openModal('seuil'),
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
        valeur: seuilLivraisonGratuite ? `${seuilLivraisonGratuite.toLocaleString("fr-FR")} FCFA` : "Chargement...",
        description: "Modifier le seuil",
        isLink: false
      },
      {
        title: "Gèrer les Portefeuilles",
        icon: Wallet,
        path: '/portefeuilles',
        color: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200",
        isLink: true
      },
    ];
  };

  // Rendu des cartes d'actions
  const renderActionCard = (action, index) => {
    if (action.isLink) {
      return (
        <Link key={index} to={action.path}>
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-600/80 mb-2">
                  {action.title}
                </p>
                <h3 className="text-2xl font-bold text-emerald-900 mt-2">
                  {action.valeur || ""}
                </h3>
                {action.description && (
                  <p className="text-xs text-emerald-600/60 mt-1">
                    {action.description}
                  </p>
                )}
              </div>
              <motion.div 
                className={`p-3 rounded-xl ${action.color} border ${action.borderColor} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <action.icon className={`w-6 h-6 ${action.textColor}`} />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      );
    }

    return (
      <motion.div
        key={index}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
        variants={itemVariants}
        whileHover="hover"
        onClick={action.onClick}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-600/80 mb-2">
              {action.title}
            </p>
            <h3 className="text-xl font-bold text-emerald-900 mt-2">
              {action.valeur || ""}
            </h3>
            {action.description && (
              <p className="text-xs text-emerald-600/60 mt-1">
                {action.description}
              </p>
            )}
          </div>
          <motion.div 
            className={`p-3 rounded-xl ${action.color} border ${action.borderColor} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <action.icon className={`w-6 h-6 ${action.textColor}`} />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">

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
        <DashboardSidebar/>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          title="Tableau de bord"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
          {/* Section Bienvenue */}
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Bon retour, Administrateur
                </h1>
                <p className="opacity-90 text-emerald-100">
                  Continuez à administrer la gestion du système Ebamage
                </p>
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="hidden sm:block"
              >
                <Calendar className="w-12 h-12 text-emerald-200" />
              </motion.div>
            </div>
          </motion.div>

          {/* Cartes d'actions rapides */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading.stats ? (
              Array(4).fill(0).map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-emerald-200 rounded mb-2 w-3/4 animate-pulse"></div>
                      <div className="h-8 bg-emerald-300 rounded mb-1 w-1/2 animate-pulse"></div>
                      <div className="h-3 bg-emerald-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-200 border border-emerald-300">
                      <div className="w-6 h-6"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              actionsPages().map((action, index) => renderActionCard(action, index))
            )}
          </motion.div>

          {/* Section Publicités */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-emerald-900">
                Publicité pour les Clients
              </h2>
              {selectedImage && (
                <motion.button
                  onClick={clearImage}
                  className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </motion.button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Zone de dépôt d'image */}
              <motion.div 
                className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/50 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById('image-upload').click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative bg-white rounded-xl border border-emerald-200 overflow-hidden max-w-md mx-auto">
                      <img 
                        src={imagePreview.url} 
                        alt="Preview"
                        className="w-full h-48 object-contain"
                      />
                      <div className="p-4">
                        <p className="text-sm text-emerald-600 font-medium truncate">
                          {imagePreview.name}
                        </p>
                        <p className="text-xs text-emerald-500 mt-1">
                          {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('image-upload').click();
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Changer l'image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-emerald-700 font-semibold">
                        Cliquez pour sélectionner une image
                      </p>
                      <p className="text-emerald-600/70 text-sm mt-1">
                        Formats supportés: JPG, PNG, GIF • Max 5MB
                      </p>
                      <p className="text-emerald-500/60 text-xs mt-1">
                        (Une seule image à la fois)
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Informations de l'image */}
              {selectedImage && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-blue-800 font-medium text-sm">
                      1 image sélectionnée
                    </p>
                    <p className="text-blue-600/80 text-xs">
                      Taille: {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              {/* Bouton d'envoi */}
              <motion.button 
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                whileHover={selectedImage && !publiciteLoading ? { scale: 1.02 } : {}}
                whileTap={selectedImage && !publiciteLoading ? { scale: 0.98 } : {}}
                onClick={handleSendPublicite}
                disabled={!selectedImage || publiciteLoading}
              >
                {publiciteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    Envoyer la publicité aux Clients
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Boutiques et Clients récents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentBoutiques
              boutiques={boutiques}
              loading={loading.boutiques}
              buttonVariants={buttonVariants}
              formatDate={formatDate} // AJOUTÉ
            />

            <RecentClients
              clients={clients}
              loading={loading.clients}
              buttonVariants={buttonVariants}
              formatDate={formatDate} // AJOUTÉ
            />
          </div>
        </main>
      </div>

      {/* Modales pour la modification des prix */}
      <ModifierPrixModal
        isOpen={modalOpen.prix}
        onClose={() => closeModal('prix')}
        type="prix"
        valeurActuelle={prixLivraison}
        onModifier={handleModifierPrix}
        loading={livraisonLoading}
      />

      <ModifierPrixModal
        isOpen={modalOpen.seuil}
        onClose={() => closeModal('seuil')}
        type="seuil"
        valeurActuelle={seuilLivraisonGratuite}
        onModifier={handleModifierSeuil}
        loading={livraisonLoading}
      />
    </div>
  );
};

export default Dashboard;