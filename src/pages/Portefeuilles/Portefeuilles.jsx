import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Store,
    RefreshCw,
    Filter,
    Search,
    CheckCircle,
    AlertCircle,
    Truck,
    X,
    Clock,
    AlertTriangle
} from "lucide-react";
import { usePortefeuilleStore } from "../../stores/portefeuilles.store";

const Portefeuilles = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatut, setFilterStatut] = useState("statut_tous");

    // Store Zustand
    const {
        soldes,
        reclamations,
        loading,
        error,
        success,
        fetchSoldes,
        fetchReclamations,
        marquerCommePaye,
        getTotals,
        getFilteredReclamations,
        getReclamationsEnAttente,
        clearMessages
    } = usePortefeuilleStore();

    // Données réelles basées sur l'API
    const reclamationsEnAttente = getReclamationsEnAttente();
    const reclamationsPayees = reclamations.filter(r => r.is_paid === true);
    const filteredReclamations = getFilteredReclamations(searchTerm, filterStatut);
    const totals = getTotals();

    // Calcul des totaux réels
    const totalPaye = reclamationsPayees.reduce((sum, reclamation) => sum + (parseFloat(reclamation.montant) || 0), 0);
    const totalEnAttente = totals.totalBoutiques;

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
    }, [error, success, clearMessages]);

    const loadData = async () => {
        try {
            await Promise.all([
                fetchSoldes(),
                fetchReclamations()
            ]);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

    const handleMarquerPaye = async (hashid, nomBoutique) => {
        if (window.confirm(
            `✅ Paiement manuel effectué ?\n\n` +
            `• Vous avez payé ${nomBoutique} manuellement\n` +
            `• Via votre téléphone (Wave, OM, etc.)\n` +
            `• Confirmer pour marquer comme réglé ?`
        )) {
            try {
                await marquerCommePaye(hashid);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSearchTerm("");
        setFilterStatut("statut_tous");
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterStatut !== "statut_tous";

    // Données statistiques globales basées sur les VRAIES DONNÉES
    const financialStats = [
        {
            title: "Solde Admin",
            amount: soldes?.solde_admin || 0,
            change: "+0%",
            trend: "up",
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-50",
            delay: 0.1
        },
        {
            title: "Solde Livreurs",
            amount: soldes?.solde_livreur || 0,
            change: "+0%",
            trend: "up",
            icon: Truck,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            delay: 0.2
        },
        {
            title: "Solde Boutiques",
            amount: soldes?.solde_boutique || 0,
            change: "+0%",
            trend: "up",
            icon: Store,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            delay: 0.3
        },
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

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            // Si la date est déjà au format "10/11/2025 19:14"
            if (dateString.includes('/')) {
                return dateString;
            }
            // Sinon, formater depuis ISO
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateString;
        }
    };

    // Squelette pour les cartes de statistiques
    const StatCardSkeleton = () => (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-200">
                    <div className="w-6 h-6 bg-emerald-300 rounded"></div>
                </div>
                <div className="h-4 bg-emerald-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-emerald-200 rounded mb-2"></div>
            <div className="h-4 bg-emerald-100 rounded w-24"></div>
        </div>
    );

    // Squelette pour les lignes du tableau
    const TableRowSkeleton = () => (
        <tr className="border-b border-emerald-50 animate-pulse">
            <td className="py-3 px-4">
                <div className="h-4 bg-emerald-200 rounded w-32 mb-2"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-emerald-200 rounded w-20"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-emerald-200 rounded w-16"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-6 bg-emerald-200 rounded w-20"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-6 bg-emerald-200 rounded w-16"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-4 bg-emerald-200 rounded w-24"></div>
            </td>
            <td className="py-3 px-4">
                <div className="h-8 bg-emerald-200 rounded w-24"></div>
            </td>
        </tr>
    );

    // Squelette pour la section réclamations
    const ReclamationSectionSkeleton = () => (
        <div className="space-y-4 animate-pulse">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-300 rounded"></div>
                        <div className="h-4 bg-green-200 rounded w-40"></div>
                    </div>
                    <div className="h-6 bg-green-200 rounded w-8"></div>
                </div>
                <div className="h-4 bg-green-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-green-300 rounded w-20"></div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                        <div className="h-4 bg-yellow-200 rounded w-48"></div>
                    </div>
                    <div className="h-6 bg-yellow-200 rounded w-8"></div>
                </div>
                <div className="h-4 bg-yellow-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-yellow-300 rounded w-20"></div>
            </div>
        </div>
    );

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
                                Gérez les soldes et paiements des boutiques
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

                    {/* Statistiques principales AVEC VRAIES DONNÉES */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {loading ? (
                            // Squeelettes pendant le chargement
                            <>
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                            </>
                        ) : (
                            financialStats.map((stat) => (
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
                            ))
                        )}
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
                                        placeholder="Rechercher par nom boutique ou code commande..."
                                        className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        disabled={loading}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                                            disabled={loading}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <select
                                    className="border border-emerald-200 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    value={filterStatut}
                                    onChange={(e) => setFilterStatut(e.target.value)}
                                    disabled={loading}
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
                                        className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                        onClick={resetFilters}
                                        disabled={loading}
                                    >
                                        <X className="w-4 h-4" />
                                        Réinitialiser
                                    </motion.button>
                                )}
                                <button 
                                    className="flex items-center gap-2 px-3 py-2 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <Filter className="w-4 h-4" />
                                    Filtres
                                </button>
                            </div>
                        </div>

                        {/* Indicateurs de filtres actifs */}
                        {hasActiveFilters && !loading && (
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

                    {/* Contenu principal */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Section Réclamations avec VRAIES DONNÉES */}
                        <motion.div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-emerald-600" />
                                    Statistiques des Réclamations
                                </h3>
                            </div>
                            
                            {loading ? (
                                <ReclamationSectionSkeleton />
                            ) : (
                                <div className="space-y-4">
                                    {/* Total des réclamations payées */}
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold text-green-800">Total des réclamations payées</span>
                                            </div>
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                                                {reclamationsPayees.length}
                                            </span>
                                        </div>
                                        <p className="text-green-600 text-sm">
                                            {reclamationsPayees.length > 0 
                                                ? `${reclamationsPayees.length} réclamation(s) déjà payée(s)`
                                                : "Aucune réclamation payée"
                                            }
                                        </p>
                                        {reclamationsPayees.length > 0 && (
                                            <p className="text-green-700 font-semibold mt-2">
                                                Montant total: {formatCurrency(totalPaye)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Total des réclamations en attente */}
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-yellow-600" />
                                                <span className="font-semibold text-yellow-800">Total des réclamations en attente</span>
                                            </div>
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-medium">
                                                {reclamationsEnAttente.length}
                                            </span>
                                        </div>
                                        <p className="text-yellow-600 text-sm">
                                            {reclamationsEnAttente.length > 0 
                                                ? `${reclamationsEnAttente.length} réclamation(s) en attente de paiement`
                                                : "Aucune réclamation en attente"
                                            }
                                        </p>
                                        {reclamationsEnAttente.length > 0 && (
                                            <p className="text-yellow-700 font-semibold mt-2">
                                                Montant à payer: {formatCurrency(totalEnAttente)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Total général */}
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                                <span className="font-semibold text-emerald-800">Total général des réclamations</span>
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm font-medium">
                                                {reclamations.length}
                                            </span>
                                        </div>
                                        <p className="text-emerald-600 text-sm mt-2">
                                            Montant total:{" "}
                                            <span className="font-semibold text-emerald-700">
                                                {formatCurrency(totalPaye + totalEnAttente)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Tableau des réclamations AVEC VRAIES DONNÉES DE L'API */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-emerald-900 text-lg flex items-center gap-2">
                                <Store className="w-5 h-5" />
                                {loading ? (
                                    <div className="h-6 bg-emerald-200 rounded w-48 animate-pulse"></div>
                                ) : (
                                    <>
                                        Réclamations Boutiques ({filteredReclamations.length})
                                        {hasActiveFilters && (
                                            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                Filtres appliqués
                                            </span>
                                        )}
                                    </>
                                )}
                            </h3>
                        </div>

                        {loading ? (
                            // Squelette du tableau pendant le chargement
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-emerald-100">
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Boutique</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Code Commande</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Montant</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut Commande</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut Paiement</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Date</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* 5 lignes de squelette */}
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                    </tbody>
                                </table>
                            </div>
                        ) : filteredReclamations.length === 0 ? (
                            <div className="text-center py-8 text-emerald-600">
                                <Store className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
                                <p className="text-lg font-medium">Aucune réclamation trouvée</p>
                                <p className="text-sm text-emerald-400">
                                    {hasActiveFilters 
                                        ? "Aucun résultat pour vos critères de filtrage" 
                                        : "Aucune réclamation à afficher"
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
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Code Commande</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Montant</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut Commande</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut Paiement</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Date</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReclamations.map((reclamation) => (
                                            <tr key={reclamation.hashid} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-emerald-900 flex-column">
                                                        {reclamation.nom_boutique || 'Boutique sans nom'}
                                                        <p className="text-sm text-gray-400">{reclamation.tel_boutique}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-emerald-600">
                                                    {reclamation.code_commande}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-emerald-900">
                                                    {formatCurrency(reclamation.montant || 0)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        reclamation.commande_statut === 'Livrée' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {reclamation.commande_statut}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        reclamation.is_paid === true 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {reclamation.is_paid === true ? 'Payé' : 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-emerald-600">
                                                    {formatDate(reclamation.date_creation)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {reclamation.is_paid === false ? (
                                                        <motion.button
                                                            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                                                            variants={buttonVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                            onClick={() => handleMarquerPaye(reclamation.hashid, reclamation.nom_boutique)}
                                                            disabled={loading}
                                                        >
                                                            <CheckCircle className="w-3 h-3" />
                                                            Confirmer paiement
                                                        </motion.button>
                                                    ) : (
                                                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm cursor-not-allowed">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Déjà payé
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Portefeuilles;