import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Activity, Bell } from "lucide-react";
import useCommandeStore from "../../stores/commande.store";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { motion } from "framer-motion";
import useNotificationStore from "../../stores/notifications.store";

const Activites = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { commandes = [], fetchCommandes } = useCommandeStore();
  const { markAllAsRead } = useNotificationStore();

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchCommandes();
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement des commandes:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchCommandes]);

  // Marquer toutes les notifications comme lues quand on arrive sur la page
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  // Activités récentes (notifications)
  const recentActivities = (commandes || []).slice(0, 10).map((cmd) => ({
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
          title="Activités Récentes"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent">
          {/* Section d'en-tête */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Activités récentes
                </h1>
                <p className="text-gray-600/80 text-lg">
                  Restez informé de l'activité de votre plateforme
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          {/* Liste des activités */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-emerald-900">
                Dernières activités
              </h2>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, index) => (
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
                      className="flex items-start p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <div className="bg-emerald-100 p-2 rounded-lg mr-4 mt-1">
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
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                    <p className="text-emerald-600/70 font-medium text-lg mb-2">
                      Aucune activité récente
                    </p>
                    <p className="text-emerald-500/60 text-sm">
                      Les activités récentes apparaîtront ici
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Statistiques */}
            {!loading && recentActivities?.length > 0 && (
              <motion.div 
                className="mt-6 pt-6 border-t border-emerald-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/40 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-700 font-medium">
                      Total des activités cette semaine
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {recentActivities.length} activité(s)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Activites;