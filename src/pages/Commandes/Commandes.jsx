import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Search, Filter, User, Store, Package, Clock, CreditCard, MapPin, CheckCircle, XCircle, Truck } from 'lucide-react';
import useCommandeStore from "../../stores/commande.store";
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import CommandeDetailModal from "./components/CommandeDetailModal";
import { motion } from "framer-motion";

const Commandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommande, setSelectedCommande] = useState(null);
    const { commandes = [], loading, error, fetchCommandes } = useCommandeStore();

    useEffect(() => {
        fetchCommandes();
    }, [fetchCommandes]);

    const filteredCommandes = (commandes || []).filter(commande => {
        try {
            return (
                commande?.client?.nom_clt?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                commande?.articles?.some(article => 
                article?.nom_article?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                article?.boutique?.nom_btq?.toLowerCase()?.includes(searchTerm.toLowerCase())
                )
            );
        } catch (e) {
            console.error("Erreur de filtrage", e);
            return false;
        }
    });

    const skeletonCount = commandes?.length > 0 ? commandes.length : 1;

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
        switch(status) {
            case 'En attente':
                return <span className={`bg-amber-100 text-amber-800 ${baseClasses}`}><Clock className="w-3 h-3" /> {status}</span>;
            case 'Validée':
                return <span className={`bg-emerald-100 text-emerald-800 ${baseClasses}`}><CheckCircle className="w-3 h-3" /> {status}</span>;
            case 'Annulée':
                return <span className={`bg-red-100 text-red-800 ${baseClasses}`}><XCircle className="w-3 h-3" /> {status}</span>;
            case 'En livraison':
                return <span className={`bg-blue-100 text-blue-800 ${baseClasses}`}><Truck className="w-3 h-3" /> {status}</span>;
            default:
                return <span className={`bg-gray-100 text-gray-800 ${baseClasses}`}>{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMM yyyy HH:mm', { locale: fr });
    };

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
        hover: { y: -4, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.12)", transition: { duration: 0.3 } }
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    if (error) return (
        <motion.div 
            className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center max-w-md">
                <p className="font-semibold mb-2">Erreur de chargement</p>
                <p className="text-sm">{error}</p>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50/30 to-emerald-50/50 flex flex-col md:flex-row">
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 w-64 h-screen`}
            >
                <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-teal-600 hover:text-teal-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <DashboardSidebar />
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">

                <DashboardHeader 
                    title="Commandes" 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* En-tête */}
                    <motion.div 
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-teal-900 mb-2">Gestion des commandes</h1>
                            <p className="text-teal-600/80">Voir toutes les commandes passées dans la plateforme</p>
                        </div>
                        {!loading && (
                            <motion.div 
                                className="flex items-center gap-2 text-teal-600/80 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-teal-100/60"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Package className="w-5 h-5" />
                                <span className="font-medium">{filteredCommandes.length} commande{filteredCommandes.length !== 1 ? 's' : ''}</span>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Barre de recherche */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100/60 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-teal-400 w-5 h-5" />
                                </div>
                                <motion.input
                                    type="text"
                                    placeholder="Rechercher une commande par client, article ou boutique..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all duration-300 bg-white/50"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>
                            <motion.button 
                                className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 border border-teal-300 rounded-xl hover:bg-teal-50 transition-all duration-300 whitespace-nowrap font-medium text-teal-700"
                                style={{ height: '48px' }}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Filter className="w-5 h-5" />
                                <span>Filtres</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Liste des commandes */}
                    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                        {loading ? (
                        // Skeletons de commandes en loading
                        Array(skeletonCount).fill(0).map((_, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100/60 p-6 animate-pulse"
                                variants={itemVariants}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-teal-200 rounded-xl" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-teal-200 rounded w-40" />
                                            <div className="h-3 bg-teal-100 rounded w-28" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 w-32">
                                        <div className="h-5 bg-teal-200 rounded" />
                                        <div className="h-4 bg-teal-100 rounded" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-teal-100 flex gap-4">
                                    <div className="h-4 bg-teal-100 rounded w-24" />
                                    <div className="h-4 bg-teal-100 rounded w-24" />
                                    <div className="h-4 bg-teal-100 rounded w-24" />
                                </div>
                            </motion.div>
                        ))
                        ) : filteredCommandes.length === 0 ? (
                        <motion.div 
                            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100/60"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Package className="w-16 h-16 text-teal-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-teal-900 mb-2">
                                {searchTerm ? "Aucune commande trouvée" : "Aucune commande disponible"}
                            </h3>
                            <p className="text-teal-600/70">
                                {searchTerm 
                                    ? "Essayez de modifier vos critères de recherche" 
                                    : "Les commandes apparaîtront ici une fois passées"
                                }
                            </p>
                        </motion.div>
                        ) : (
                            filteredCommandes.map((commande) => (
                                <motion.div 
                                    key={commande.hashid} 
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100/60 overflow-hidden cursor-pointer group"
                                    variants={itemVariants}
                                    whileHover="hover"
                                    onClick={() => setSelectedCommande(commande)}
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <motion.div 
                                                    className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl shadow-lg"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Package className="w-6 h-6 text-white" />
                                                </motion.div>
                                                <div>
                                                    <h3 className="font-semibold text-teal-900 text-lg">
                                                        Commande #{commande.hashid.substring(0, 8)}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <User className="w-4 h-4 text-teal-500" />
                                                        <span className="text-sm text-teal-600/80">{commande.client.nom_clt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col lg:items-end gap-3">
                                                <div className="text-xl font-bold text-teal-900">
                                                    {commande.prix_total_commande.toLocaleString('fr-FR')} FCFA
                                                </div>
                                                {getStatusBadge(commande.statut)}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-teal-100">
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-teal-600/80">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-4 h-4 text-teal-500" />
                                                    <span>{commande.articles[0]?.boutique.nom_btq || 'Boutique inconnue'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-teal-500" />
                                                    <span>{commande.moyen_de_paiement}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-teal-500" />
                                                    <span>{commande.localisation.commune}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-teal-500" />
                                                    <span>{formatDate(commande.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Modal de détail */}
                    {selectedCommande && (
                        <CommandeDetailModal 
                            commande={selectedCommande} 
                            onClose={() => setSelectedCommande(null)} 
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default Commandes;
