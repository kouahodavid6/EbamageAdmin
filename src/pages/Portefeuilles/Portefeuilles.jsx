// Portefeuilles.jsx
import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    PieChart,
    Eye,
    Download,
    Store,
    RefreshCw,
    Filter,
    Search,
    CheckCircle,
    AlertCircle,
    Truck,
    Building,
    X
} from "lucide-react";
import { usePortefeuilleStore } from "../../stores/portefeuilles.store";

const Portefeuilles = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("tous");
    const [filterStatut, setFilterStatut] = useState("statut_tous");
    const [showFilters, setShowFilters] = useState(false);

    // Store Zustand
    const {
        soldeAdmin,
        loading,
        error,
        success,
        fetchSoldeAdmin,
        fetchPortefeuilles,
        marquerCommePaye,
        getTotals,
        getFilteredPortefeuilles,
        clearMessages
    } = usePortefeuilleStore();

    // Données filtrées avec tous les filtres
    const filteredData = getFilteredPortefeuilles(searchTerm, filterType, filterStatut);
    const totals = getTotals();

    // Chargement initial
    useEffect(() => {
        loadData();
    }, []);

    // Clear messages après 5 secondes
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                clearMessages();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const loadData = async () => {
        try {
            await Promise.all([
                fetchSoldeAdmin(),
                fetchPortefeuilles()
            ]);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

    const handleMarquerPaye = async (hashid, type, nom) => {
        if (window.confirm(`Marquer le portefeuille de ${nom} comme payé ?`)) {
            try {
                await marquerCommePaye(hashid, type);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSearchTerm("");
        setFilterType("tous");
        setFilterStatut("statut_tous");
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterType !== "tous" || filterStatut !== "statut_tous";

    // Données statistiques globales basées sur les données réelles
    const financialStats = [
        {
            title: "Solde Admin",
            amount: soldeAdmin?.solde_admin || 0,
            change: "+0%",
            trend: "up",
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-50",
            delay: 0.1
        },
        {
            title: "Total à Payer Boutiques",
            amount: totals.totalBoutiques,
            change: "+0%",
            trend: "up",
            icon: Store,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            delay: 0.2
        },
        {
            title: "Total à Payer Livreurs",
            amount: totals.totalLivreurs,
            change: "+0%",
            trend: "up",
            icon: Truck,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            delay: 0.3
        },
        {
            title: "Total Déjà Payé",
            amount: totals.totalPaye,
            change: "+0%",
            trend: "up",
            icon: CheckCircle,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            delay: 0.4
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
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
                    title="Gestion des Portefeuilles"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Messages d'alerte */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            {success}
                        </motion.div>
                    )}

                    {/* En-tête avec actions */}
                    <motion.div
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                                Gestion des Portefeuilles
                            </h1>
                            <p className="text-emerald-600/80">
                                Gérez les soldes et paiements des boutiques et livreurs
                            </p>
                        </div>
                        <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => loadData()}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Chargement...' : 'Actualiser'}
                        </motion.button>
                    </motion.div>

                    {/* Navigation par onglets */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="flex space-x-1 overflow-x-auto">
                            {["overview", "boutiques", "livreurs", "tous"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                        activeTab === tab
                                            ? "bg-emerald-500 text-white shadow-lg"
                                            : "text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                >
                                    {tab === "overview" && "Aperçu général"}
                                    {tab === "boutiques" && "Portefeuilles Boutiques"}
                                    {tab === "livreurs" && "Portefeuilles Livreurs"}
                                    {tab === "tous" && "Tous les Portefeuilles"}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Statistiques principales */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {financialStats.map((stat) => (
                            <motion.div
                                key={stat.title}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 hover:shadow-xl transition-all duration-300"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <span className={`text-sm font-medium flex items-center gap-1 ${
                                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-900 mb-1">
                                    {formatCurrency(stat.amount)}
                                </h3>
                                <p className="text-emerald-600/70 text-sm">{stat.title}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Barre de recherche et filtres */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher par nom ou email..."
                                        className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <select
                                    className="border border-emerald-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="tous">Tous les types</option>
                                    <option value="boutiques">Boutiques seulement</option>
                                    <option value="livreurs">Livreurs seulement</option>
                                </select>
                                <select
                                    className="border border-emerald-200 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    value={filterStatut}
                                    onChange={(e) => setFilterStatut(e.target.value)}
                                >
                                    <option value="statut_tous">Tous les statuts</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="payé">Payé</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                {hasActiveFilters && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={resetFilters}
                                    >
                                        <X className="w-4 h-4" />
                                        Réinitialiser
                                    </motion.button>
                                )}
                                <button 
                                    className="flex items-center gap-2 px-3 py-2 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="w-4 h-4" />
                                    Filtres
                                </button>
                            </div>
                        </div>

                        {/* Indicateurs de filtres actifs */}
                        {hasActiveFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 flex flex-wrap gap-2"
                            >
                                <span className="text-sm text-emerald-600 font-medium">Filtres actifs:</span>
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        Recherche: "{searchTerm}"
                                        <button onClick={() => setSearchTerm("")}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {filterType !== "tous" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                        Type: {filterType === "boutiques" ? "Boutiques" : "Livreurs"}
                                        <button onClick={() => setFilterType("tous")}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {filterStatut !== "statut_tous" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                        Statut: {filterStatut === "payé" ? "Payé" : "En attente"}
                                        <button onClick={() => setFilterStatut("statut_tous")}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Contenu des onglets */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Graphique des répartitions */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-emerald-600" />
                                        Répartition des portefeuilles
                                    </h3>
                                </div>
                                <div className="h-64 flex items-center justify-center">
                                    <div className="text-center text-emerald-600">
                                        <Building className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
                                        <p className="text-sm">{filteredData.boutiques.length} Boutiques</p>
                                        <p className="text-sm">{filteredData.livreurs.length} Livreurs</p>
                                        <p className="text-xs text-emerald-400 mt-2">
                                            {hasActiveFilters ? 'Résultats filtrés' : 'Total'}: {formatCurrency(totals.totalAPayer)}
                                        </p>
                                        {hasActiveFilters && (
                                            <p className="text-xs text-blue-500 mt-1">
                                                Filtres appliqués
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Informations admin */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-emerald-600" />
                                        Informations Administrateur
                                    </h3>
                                    <Eye className="w-5 h-5 text-emerald-400 cursor-pointer" />
                                </div>
                                {soldeAdmin ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                                {soldeAdmin.nom?.charAt(0) || 'A'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-emerald-900">{soldeAdmin.nom}</p>
                                                <p className="text-sm text-emerald-600/70">{soldeAdmin.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <p className="text-blue-600/70">Téléphone</p>
                                                <p className="font-semibold text-blue-900">{soldeAdmin.tel}</p>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <p className="text-green-600/70">Rôle</p>
                                                <p className="font-semibold text-green-900 capitalize">{soldeAdmin.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg text-white">
                                            <p className="text-sm opacity-90">Solde Actuel</p>
                                            <p className="text-2xl font-bold">{formatCurrency(soldeAdmin.solde_admin)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-emerald-600">
                                        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                        <p>Chargement des informations...</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}

                    {/* Onglet Boutiques */}
                    {(activeTab === "boutiques" || activeTab === "tous") && (
                        <motion.div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-emerald-900 text-lg flex items-center gap-2">
                                    <Store className="w-5 h-5" />
                                    Portefeuilles Boutiques ({filteredData.boutiques.length})
                                    {hasActiveFilters && (
                                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            Filtres appliqués
                                        </span>
                                    )}
                                </h3>
                            </div>

                            {filteredData.boutiques.length === 0 ? (
                                <div className="text-center py-12 text-emerald-600">
                                    <Store className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
                                    <p className="text-lg font-medium">Aucune boutique trouvée</p>
                                    <p className="text-sm text-emerald-400">
                                        {hasActiveFilters 
                                            ? "Aucun résultat pour vos critères de filtrage" 
                                            : "Aucune boutique à afficher"
                                        }
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={resetFilters}
                                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-emerald-100">
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Boutique</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Contact</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Solde à Payer</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut Paiement</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Dernière Mise à Jour</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.boutiques.map((boutique) => (
                                                <tr key={boutique.hashid} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-emerald-900">{boutique.nom}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-sm text-emerald-600">{boutique.email}</div>
                                                        <div className="text-xs text-emerald-400">{boutique.tel}</div>
                                                    </td>
                                                    <td className="py-3 px-4 font-bold text-emerald-900">
                                                        {formatCurrency(boutique.solde_a_payer || 0)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            boutique.statut_paiement === 'payé' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {boutique.statut_paiement === 'payé' ? 'Payé' : 'En attente'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-emerald-600">
                                                        {boutique.updated_at ? formatDate(boutique.updated_at) : 'N/A'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {boutique.statut_paiement !== 'payé' && (
                                                            <motion.button
                                                                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                                                                variants={buttonVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                onClick={() => handleMarquerPaye(boutique.hashid, 'boutique', boutique.nom)}
                                                                disabled={loading}
                                                            >
                                                                <CheckCircle className="w-3 h-3" />
                                                                Marquer payé
                                                            </motion.button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Onglet Livreurs */}
                    {(activeTab === "livreurs" || activeTab === "tous") && (
                        <motion.div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-emerald-900 text-lg flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Portefeuilles Livreurs ({filteredData.livreurs.length})
                                    {hasActiveFilters && (
                                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            Filtres appliqués
                                        </span>
                                    )}
                                </h3>
                            </div>

                            {filteredData.livreurs.length === 0 ? (
                                <div className="text-center py-12 text-emerald-600">
                                    <Truck className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
                                    <p className="text-lg font-medium">Aucun livreur trouvé</p>
                                    <p className="text-sm text-emerald-400">
                                        {hasActiveFilters 
                                            ? "Aucun résultat pour vos critères de filtrage" 
                                            : "Aucun livreur à afficher"
                                        }
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={resetFilters}
                                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-emerald-100">
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Livreur</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Contact</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Solde à Payer</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut Paiement</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Dernière Mise à Jour</th>
                                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.livreurs.map((livreur) => (
                                                <tr key={livreur.hashid} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-emerald-900">
                                                            {livreur.prenom} {livreur.nom}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-sm text-emerald-600">{livreur.email}</div>
                                                        <div className="text-xs text-emerald-400">{livreur.tel}</div>
                                                    </td>
                                                    <td className="py-3 px-4 font-bold text-emerald-900">
                                                        {formatCurrency(livreur.solde_a_payer || 0)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            livreur.statut_paiement === 'payé' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {livreur.statut_paiement === 'payé' ? 'Payé' : 'En attente'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-emerald-600">
                                                        {livreur.updated_at ? formatDate(livreur.updated_at) : 'N/A'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {livreur.statut_paiement !== 'payé' && (
                                                            <motion.button
                                                                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                                                                variants={buttonVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                onClick={() => handleMarquerPaye(livreur.hashid, 'livreur', `${livreur.prenom} ${livreur.nom}`)}
                                                                disabled={loading}
                                                            >
                                                                <CheckCircle className="w-3 h-3" />
                                                                Marquer payé
                                                            </motion.button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Portefeuilles;