import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import RecentBoutiques from "./components/RecentBoutiques";
import RecentClients from "./components/RecentClients";
import {
  Users,
  Bell,
  Store,
  PieChart,
  Activity,
  ArrowRight,
  Calendar,
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
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState({
    stats: true,
    activities: true,
    boutiques: true,
    clients: true
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { commandes = [], fetchCommandes } = useCommandeStore();
  const { boutiques = [], fetchBoutiques } = useBoutiqueStore();
  const { clients = [], fetchClients } = useClientStore();
  const { fetchCategories } = useCategorieStore();
  const { 
    sendToClients, 
    loading: publiciteLoading, 
    error, 
    success, 
    clearState 
  } = usePubliciteStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCommandes(),
          fetchBoutiques(),
          fetchClients(),
          fetchCategories(),
        ]);
        setLoading({
          stats: false,
          activities: false,
          boutiques: false,
          clients: false
        });
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setLoading({
          stats: false,
          activities: false,
          boutiques: false,
          clients: false
        });
      }
    };

    loadData();
  }, [fetchCommandes, fetchBoutiques, fetchClients, fetchCategories]);

  // Gérer les succès et erreurs avec les toasts
  useEffect(() => {
    if (success) {
      toast.success('Publicité envoyée avec succès !');
      clearState();
      clearImage();
    }
    if (error) {
      toast.error(error);
      clearState();
    }
  }, [success, error, clearState]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  // Gérer la sélection d'une seule image
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Vérifier la taille du fichier
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image dépasse la taille maximale de 5MB");
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    setSelectedImage(file);

    // Créer la preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview({
        url: e.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);

    clearState();
    
    // Réinitialiser l'input file
    event.target.value = '';
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Envoyer la publicité (UNE SEULE IMAGE)
  const handleSendPublicite = async () => {
    if (!selectedImage) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    try {
      const formData = new FormData();

      // ✅ UNE SEULE IMAGE avec la clé "images"
      formData.append('images', selectedImage);

      await sendToClients(formData);

      // Le reset se fait dans le useEffect du succès
    } catch (error) {
      console.error('Erreur envoi publicité:', error);
      // L'erreur est déjà gérée par le store et affichée dans le toast
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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

  const actionsPages = () => {
    return [
      {
        title: "Envoyer des notifications",
        icon: Bell,
        path: '/sendNotifications',
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200"
      },
      {
        title: "Gérer les boutiques",
        icon: Store,
        path: '/boutiques',
        color: "bg-blue-100",
        textColor: "text-blue-600",
        borderColor: "border-blue-200"
      },
      {
        title: "Gérer les clients",
        icon: Users,
        path: '/clients',
        color: "bg-purple-100",
        textColor: "text-purple-600",
        borderColor: "border-purple-200"
      },
      {
        title: "Finances",
        icon: PieChart,
        path: '/finances',
        color: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200"
      },
    ];
  };

  const recentActivities = (commandes || []).slice(0, 5).map((cmd) => ({
    id: cmd?.hashid || Math.random().toString(),
    user: cmd?.client?.nom_clt || "Client inconnu",
    action: "a passé une commande",
    time: formatDate(cmd?.created_at),
    amount: `${(cmd?.prix_total_commande || 0).toLocaleString("fr-FR")} FCFA`,
  }));

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
        {/* Croix mobile */}
        <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
            <button
                onClick={() => setSidebarOpen(false)}
                className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                aria-label="Fermer la sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              // Loading state for stats
              Array(4).fill(0).map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-emerald-200 rounded mb-2 w-3/4"></div>
                      <div className="h-8 bg-emerald-300 rounded mb-1 w-1/2"></div>
                      <div className="h-3 bg-emerald-200 rounded w-1/4"></div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-200 border border-emerald-300">
                      <div className="w-6 h-6"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Actual actions content - VERSION CLIQUABLE
              actionsPages().map((action, index) => (
                <Link key={index} to={action.path}>
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-600/80 mb-1">
                          {action.title}
                        </p>
                        <h3 className="text-2xl font-bold text-emerald-900 mt-1">
                          {/* Vous pouvez ajouter des valeurs dynamiques ici si besoin */}
                        </h3>
                      </div>
                      <motion.div 
                        className={`p-3 rounded-xl ${action.color} border ${action.borderColor} group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <action.icon className={`w-6 h-6 ${action.textColor}`} />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </motion.div>

          {/* Publicités et Activités */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section Publicités - VERSION UNE SEULE IMAGE */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                {/* Zone de dépôt d'image - VERSION UNE SEULE IMAGE */}
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

            {/* Activités récentes */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-emerald-900">
                  Activités récentes
                </h2>
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              {loading.activities ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex items-start p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <div className="bg-emerald-200 p-2 rounded-lg mr-3 mt-1 animate-pulse">
                        <div className="w-4 h-4"></div>
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-emerald-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-emerald-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities?.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <motion.div 
                        key={activity.id} 
                        className="flex items-start p-3 bg-emerald-50/50 rounded-xl border border-emerald-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                      >
                        <div className="bg-emerald-100 p-2 rounded-lg mr-3 mt-1">
                          <Activity className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-900">
                            <span className="font-semibold">{activity.user}</span>{" "}
                            {activity.action}
                            {activity.amount && (
                              <span className="text-emerald-600 ml-1 font-semibold">
                                ({activity.amount})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-emerald-600/70 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                      <p className="text-emerald-600/70 font-medium">Aucune activité récente</p>
                    </div>
                  )}
                </div>
              )}
              {!loading.activities && commandes?.length > 0 && (
                <Link to="/commandes">
                  <motion.button 
                    className="w-full mt-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center gap-2 transition-all duration-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span>Voir toutes les activités</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Boutiques et Clients récents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentBoutiques
              boutiques={boutiques}
              loading={loading.boutiques}
              formatDate={formatDate}
              buttonVariants={buttonVariants}
            />

            <RecentClients
              clients={clients}
              loading={loading.clients}
              formatDate={formatDate}
              buttonVariants={buttonVariants}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;