import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Search, Filter, User, Store, Package, Clock, CreditCard, MapPin } from 'lucide-react';
import useCommandeStore from "../../stores/commande.store";
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import CommandeDetailModal from "./components/CommandeDetailModal";

const Commandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommande, setSelectedCommande] = useState(null);
    const { commandes = [], loading, error, fetchCommandes } = useCommandeStore();

    useEffect(() => {
        fetchCommandes();
    }, [fetchCommandes]);

    // Vérification plus sécurisée
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

    const getStatusBadge = (status) => {
        switch(status) {
            case 'En attente':
                return <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {status}</span>;
            case 'Validée':
                return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {status}</span>;
            case 'Annulée':
                return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3" /> {status}</span>;
            case 'En livraison':
                return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Truck className="w-3 h-3" /> {status}</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMM yyyy HH:mm', { locale: fr });
    };

    if (loading) return <div className="flex-1 flex items-center justify-center">Chargement...</div>;
    if (error) return <div className="flex-1 flex items-center justify-center text-red-500">Erreur: {error}</div>;

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
                md:translate-x-0 w-64 h-screen bg-white shadow-md`}
            >
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                        aria-label="Fermer la sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
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

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">Gestion des commandes</h1>
                            <p className="text-gray-600 mt-1 text-xs xs:text-sm sm:text-base">
                                Voir toutes les commandes passées dans la plateforme
                            </p>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
                            {/* Barre de recherche */}
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-gray-400 w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une commande..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>

                            {/* Bouton Filtres - toujours aligné */}
                            <button 
                                className="flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                                style={{ height: '42px' }}
                            >
                                <Filter className="w-5 h-5 flex-shrink-0" />
                                <span className="hidden xs:inline">Filtres</span>
                            </button>
                        </div>
                    </div>

                    {/* Liste des commandes */}
                    <div className="space-y-4">
                        {filteredCommandes.map((commande) => (
                            <div 
                                key={commande.hashid} 
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedCommande(commande)}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-pink-50 p-3 rounded-lg">
                                                <Package className="w-6 h-6 text-pink-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Commande #{commande.hashid.substring(0, 8)}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{commande.client.nom_clt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2">
                                            <div className="text-lg font-semibold text-gray-900">
                                                {commande.prix_total_commande.toLocaleString('fr-FR')} FCFA
                                            </div>
                                            {getStatusBadge(commande.statut)}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Store className="w-4 h-4" />
                                                <span>{commande.articles[0]?.boutique.nom_btq || 'Boutique inconnue'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                <span>{commande.moyen_de_paiement}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{commande.localisation.commune}</span> 
                                                {/* {commande.localisation.quartier} */}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(commande.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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