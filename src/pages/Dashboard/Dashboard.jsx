import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  Activity,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import useCommandeStore from "../../stores/commande.store";
import useBoutiqueStore from "../../stores/boutique.store";
import useClientStore from "../../stores/client.store";
import useCategorieStore from "../../stores/categorie.store";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chargement des données avec valeurs par défaut
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
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchCommandes, fetchBoutiques, fetchClients, fetchCategories]);

  // Fonctions utilitaires
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  // Calcul des statistiques avec vérifications
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
        color: "bg-pink-100",
        textColor: "text-pink-600",
      },
      {
        title: "Nouveaux clients",
        value: newClientsToday,
        change: "+0%",
        icon: Users,
        color: "bg-blue-100",
        textColor: "text-blue-600",
      },
      {
        title: "Produits vendus",
        value: totalProductsSold,
        change: "+0%",
        icon: Package,
        color: "bg-purple-100",
        textColor: "text-purple-600",
      },
      {
        title: "Revenu journalier",
        value: `${dailyRevenue.toLocaleString("fr-FR")} FCFA`,
        change: "+0%",
        icon: CreditCard,
        color: "bg-green-100",
        textColor: "text-green-600",
      },
    ];
  };

  // Activités récentes (5 dernières commandes) avec vérification
  const recentActivities = (commandes || []).slice(0, 5).map((cmd) => ({
    id: cmd?.hashid || Math.random().toString(),
    user: cmd?.client?.nom_clt || "Client inconnu",
    action: "a passé une commande",
    time: formatDate(cmd?.created_at),
    amount: `${(cmd?.prix_total_commande || 0).toLocaleString("fr-FR")} FCFA`,
  }));

  // Boutiques récentes (3 dernières) avec vérification
  const recentBoutiques = (boutiques || []).slice(0, 3);

  // Clients récents (3 derniers) avec vérification
  const recentClients = (clients || []).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 z-40 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 w-64 h-screen bg-white shadow-md`}>
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Fermer la sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          title="Tableau de bord"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
          {/* Section Bienvenue */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Bon retour, Administrateur
            </h1>
            {/* <p className="opacity-90">
                            {commandes?.length > 0 ? 
                                `Vous avez ${commandes.length} commandes à traiter` : 
                                "Aucune commande aujourd'hui"}
                        </p> */}
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {calculateStats().map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p className={`text-sm mt-1 ${stat.textColor}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Graphique et Activités */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Graphique (placeholder) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance des ventes
                </h2>
                <select className="text-sm border border-gray-200 rounded px-2 py-1 bg-gray-50">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>Cette année</option>
                </select>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {commandes?.length > 0
                      ? "Graphique des performances"
                      : "Aucune donnée disponible"}
                  </p>
                </div>
              </div>
            </div>

            {/* Activités récentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Activités récentes
              </h2>
              <div className="space-y-4">
                {recentActivities?.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="bg-pink-100 p-2 rounded-lg mr-3">
                        <Activity className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <span className="text-gray-900">{activity.user}</span>{" "}
                          {activity.action}
                          {activity.amount && (
                            <span className="text-pink-600 ml-1">
                              ({activity.amount})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune activité récente
                  </p>
                )}
              </div>
              {commandes?.length > 0 && (
                <button className="text-pink-600 text-sm font-medium mt-4 hover:text-pink-700 transition-colors">
                  Voir toutes les activités
                </button>
              )}
            </div>
          </div>

          {/* Boutiques et Clients récents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Boutiques récentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Boutiques récentes
                </h2>
                {boutiques?.length > 0 && (
                  <Link to="/boutiques">
                    <button className="text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors">
                      Voir toutes
                    </button>
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {recentBoutiques?.length > 0 ? (
                  recentBoutiques.map((boutique) => (
                    <div key={boutique.hashid} className="flex items-center">
                      <div className="bg-gray-100 w-10 h-10 rounded-full mr-3 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {boutique.nom_btq}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Ajoutée le {formatDate(boutique.created_at)}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune boutique récente
                  </p>
                )}
              </div>
            </div>

            {/* Clients récents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Nouveaux clients
                </h2>
                {clients?.length > 0 && (
                  <Link to="/clients">
                    <button className="text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors">
                      Voir tous
                    </button>
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {recentClients?.length > 0 ? (
                  recentClients.map((client) => (
                    <div key={client.hashid} className="flex items-center">
                      <div className="bg-gray-100 w-10 h-10 rounded-full mr-3 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {client.nom_clt}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Inscrit le {formatDate(client.created_at)}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucun nouveau client
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
