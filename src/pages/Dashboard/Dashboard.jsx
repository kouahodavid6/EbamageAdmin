import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import {
  Users,
  User,
  ShoppingBag,
  Package,
  TrendingUp,
  Activity,
  CreditCard,
  Store,
  ArrowRight,
  Calendar,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import useCommandeStore from "../../stores/commande.store";
import useBoutiqueStore from "../../stores/boutique.store";
import useClientStore from "../../stores/client.store";
import useCategorieStore from "../../stores/categorie.store";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState({
    stats: true,
    activities: true,
    boutiques: true,
    clients: true,
    performance: true
  });

  const { commandes = [], fetchCommandes } = useCommandeStore();
  const { boutiques = [], fetchBoutiques } = useBoutiqueStore();
  const { clients = [], fetchClients } = useClientStore();
  const { fetchCategories } = useCategorieStore();

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
          clients: false,
          performance: false
        });
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setLoading({
          stats: false,
          activities: false,
          boutiques: false,
          clients: false,
          performance: false
        });
      }
    };

    loadData();
  }, [fetchCommandes, fetchBoutiques, fetchClients, fetchCategories]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return "Date invalide";
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

  const calculateStats = () => {
    const today = new Date().toISOString().split("T")[0];

    const commandesToday =
      commandes?.filter(
        (c) =>
          c?.created_at &&
          new Date(c.created_at).toISOString().split("T")[0] === today
      )?.length || 0;

    const newClientsToday =
      clients?.filter(
        (c) =>
          c?.created_at &&
          new Date(c.created_at).toISOString().split("T")[0] === today
      )?.length || 0;

    const totalProductsSold =
      commandes?.reduce(
        (acc, cmd) =>
          acc +
          (cmd?.articles?.reduce((sum, art) => sum + (art?.quantite || 0), 0) ||
            0),
        0
      ) || 0;

    const dailyRevenue =
      commandes?.reduce(
        (sum, cmd) => sum + (cmd?.prix_total_commande || 0),
        0
      ) || 0;

    return [
      {
        title: "Commandes aujourd'hui",
        value: commandesToday,
        change: "+0%",
        icon: ShoppingBag,
        color: "bg-emerald-100",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200"
      },
      {
        title: "Nouveaux clients",
        value: newClientsToday,
        change: "+0%",
        icon: Users,
        color: "bg-blue-100",
        textColor: "text-blue-600",
        borderColor: "border-blue-200"
      },
      {
        title: "Produits vendus",
        value: totalProductsSold,
        change: "+0%",
        icon: Package,
        color: "bg-purple-100",
        textColor: "text-purple-600",
        borderColor: "border-purple-200"
      },
      {
        title: "Revenu journalier",
        value: `${dailyRevenue.toLocaleString("fr-FR")} FCFA`,
        change: "+0%",
        icon: CreditCard,
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

const getRecent = (arr) => {
  const n = arr.length;
  const start = Math.max(n - 3);
  return arr.slice(start, n);
};

// Utilisation
const recentBoutiques = getRecent(boutiques || []);
const recentClients = getRecent(clients || []);

  const skeletonCountClt = clients?.length > 0 ? clients.length : 3;
  const skeletonCountBtq = boutiques?.length > 0 ? boutiques.length : 3;

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
                  {commandes?.length > 0 ? 
                    `Vous avez ${commandes.length} commandes à traiter` : 
                    "Aucune commande aujourd'hui"}
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

          {/* Cartes de statistiques */}
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
              // Actual stats content
              calculateStats().map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600/80 mb-1">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold text-emerald-900 mt-1">{stat.value}</h3>
                      <p className={`text-sm mt-1 font-medium ${stat.textColor}`}>
                        {stat.change}
                      </p>
                    </div>
                    <motion.div 
                      className={`p-3 rounded-xl ${stat.color} border ${stat.borderColor}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </motion.div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Graphique et Activités */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphique (placeholder) */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-emerald-900">
                  Performance des ventes
                </h2>
                <motion.select 
                  className="text-sm border border-emerald-200 rounded-lg px-3 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  disabled={loading.performance}
                >
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>Cette année</option>
                </motion.select>
              </div>
              {loading.performance ? (
                <div className="h-64 bg-gradient-to-br from-emerald-50 to-green-50/30 rounded-xl border border-emerald-100 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-emerald-50 to-green-50/30 rounded-xl border border-emerald-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <TrendingUp className="w-16 h-16 text-emerald-300 mx-auto mb-3" />
                    <p className="text-emerald-600/70 font-medium">
                      {commandes?.length > 0
                        ? "Graphique des performances"
                        : "Aucune donnée disponible"}
                    </p>
                    {commandes?.length === 0 && (
                      <p className="text-emerald-500/60 text-sm mt-1">
                        Les données apparaîtront ici
                      </p>
                    )}
                  </div>
                </div>
              )}
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
                <motion.button 
                  className="w-full mt-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center gap-2 transition-all duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span>Voir toutes les activités</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Boutiques et Clients récents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Boutiques récentes */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Store className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-sm sm:text-lg font-semibold text-emerald-900">
                    Boutiques récentes
                  </h2>
                </div>
                {!loading.boutiques && boutiques?.length > 0 && (
                  <Link to="/boutiques">
                    <motion.button 
                      className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-all duration-300 text-sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Voir toutes
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </Link>
                )}
              </div>
              {loading.boutiques ? (
                <div className="space-y-4">
                  {Array(skeletonCountBtq).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <div className="bg-emerald-200 border border-emerald-300 w-10 h-10 rounded-lg mr-3 flex items-center justify-center animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-emerald-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-emerald-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="text-emerald-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBoutiques?.length > 0 ? (
                    recentBoutiques
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // ✅ tri du plus récent au plus ancien
                      .map((boutique, index) => {
                        // Récupérer le nom et l'initiale
                        const nom = boutique?.nom_btq?.toUpperCase() || "Boutique";
                        const initiale = nom.charAt(0);

                        return (
                          <motion.div 
                            key={boutique.hashid} 
                            className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-white transition-all duration-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            whileHover={{ x: 5 }}
                          >
                            {/* Avatar avec initiale */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-semibold shadow-lg">
                                    {initiale}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <Store className="w-2 h-2 text-white" />
                                </div>
                            </div>

                            {/* Infos boutique */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-emerald-900 text-sm">
                                {boutique.nom_btq}
                              </h4>
                              <p className="text-xs text-emerald-600/70">
                                Inscrite le {formatDate(boutique.created_at)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8">
                      <Store className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                      <p className="text-emerald-600/70 font-medium">Aucune boutique récente</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Clients récents */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-sm sm:text-sm font-semibold text-emerald-900">
                    Nouveaux clients
                  </h2>
                </div>
                {!loading.clients && clients?.length > 0 && (
                  <Link to="/clients">
                    <motion.button 
                      className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-all duration-300 text-sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Voir tous
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </Link>
                )}
              </div>
              {loading.clients ? (
                <div className="space-y-4">
                  {Array(skeletonCountClt).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <div className="bg-emerald-200 w-10 h-10 rounded-lg mr-3 flex items-center justify-center animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-emerald-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-emerald-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="text-emerald-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentClients?.length > 0 ? (
                    recentClients
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) //
                    .map((client, index) => {
                      // Récupérer le nom et l'initiale
                      const nom = client?.nom_clt?.toUpperCase() || "Client";
                      const initiale = nom.charAt(0);

                      return (
                        <motion.div 
                            key={client.hashid} 
                            className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-white transition-all duration-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            whileHover={{ x: 5 }}
                          >
                            {/* Avatar avec initiale */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-semibold shadow-lg">
                                    {initiale}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <User className="w-2 h-2 text-white" />
                                </div>
                            </div>

                            {/* Infos boutique */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-emerald-900 text-sm">
                                {client.nom_clt}
                              </h4>
                              <p className="text-xs text-emerald-600/70">
                                Inscrite le {formatDate(client.created_at)}
                              </p>
                            </div>
                          </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                      <p className="text-emerald-600/70 font-medium">Aucun nouveau client</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;