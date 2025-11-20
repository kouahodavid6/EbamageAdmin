import { useEffect, useState } from "react";
import { Plus, Settings, Edit3, Trash2, Search } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import useVariationStore from "../../stores/variation.store";
import VariationModal from "./components/VariationModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { motion } from "framer-motion";

const Variations = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [variationToDelete, setVariationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { variations, fetchVariations, loading, deleteVariation } = useVariationStore();

    useEffect(() => {
        fetchVariations();
    }, [fetchVariations]);

    const handleDeleteClick = (variation) => {
        setVariationToDelete(variation);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!variationToDelete) return;
        
        setIsDeleting(true);
        const result = await deleteVariation(variationToDelete.hashid);
        setIsDeleting(false);
        
        if (result.success) {
            setDeleteModalOpen(false);
            setVariationToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setVariationToDelete(null);
    };

    const isColorVariation = (variation) => {
        return variation.nom_variation === 'color';
    };

    // Filtrer les variations par nom_variation
    const filteredVariations = variations.filter((variation) =>
        variation.nom_variation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Animations
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
        },
        hover: {
            y: -4,
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)",
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50/20 flex flex-col md:flex-row">
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
                    title="Variations"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-transparent space-y-6">
                    {/* En-tête */}
                    <motion.div 
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-green-900">
                                Gestion des variations
                            </h1>
                            <p className="text-green-600 mt-1 text-xs xs:text-sm sm:text-base">
                                Définissez les types de variations pour vos produits
                            </p>
                            <div>
                                <h1 className="font-bold mb-3 text-sm md:text-base">Variation requise :</h1>
                                <div className="flex flex-wrap items-center gap-1 md:gap-2">
                                    <p className="bg-emerald-200 py-1 px-2 md:px-3 rounded-lg font-bold text-sm md:text-base whitespace-nowrap">
                                        Couleur
                                    </p>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            onClick={() => setModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition w-full sm:w-auto shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Nouvelle variation</span>
                        </motion.button>
                    </motion.div>

                    {/* Barre de recherche */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/60 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-green-400 w-5 h-5" />
                                </div>
                                <motion.input
                                    type="text"
                                    placeholder="Rechercher une variation par nom..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-300 bg-white/50"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Liste ou Skeleton */}
                    <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {loading ? (
                            // 🦴 Skeleton loader
                            Array.from({ length: 3 }).map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/60 p-6 animate-pulse"
                                    variants={itemVariants}
                                >
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-green-200 rounded-xl"></div>
                                        <div className="space-y-2">
                                            <div className="h-6 bg-green-200 rounded w-32"></div>
                                            <div className="h-4 bg-green-200 rounded w-24"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-green-200 rounded w-20"></div>
                                        <div className="h-8 bg-green-200 rounded w-16"></div>
                                        <div className="h-8 bg-green-200 rounded w-24"></div>
                                    </div>
                                </motion.div>
                            ))
                        ) : filteredVariations.length > 0 ? (
                            // ✅ Liste réelle
                            filteredVariations.map((variation) => (
                                <motion.div
                                    key={variation.hashid}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/60 p-6 hover:shadow-xl transition-all duration-300"
                                    variants={itemVariants}
                                    whileHover="hover"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-inner">
                                                <Settings className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-green-900">
                                                    {variation.nom_variation === 'color' ? 'Couleur' : variation.nom_variation}
                                                </h3>
                                                {isColorVariation(variation) && (
                                                    <span className="text-xs text-amber-600 font-medium bg-amber-100 px-3 py-1 rounded-full mt-1 inline-block">
                                                        Variation requise
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Boutons d'action - cachés pour "color" */}
                                        {!isColorVariation(variation) && (
                                            <div className="flex items-center space-x-1">
                                                <motion.button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Modifier"
                                                    onClick={() => {/* À implémenter quand disponible */}}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Supprimer"
                                                    onClick={() => handleDeleteClick(variation)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>

                                    {variation.valeurs?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-green-700 mb-3">
                                                Valeurs disponibles :
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {variation.valeurs.map((val, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-800 border border-green-200 font-medium shadow-sm"
                                                    >
                                                        {val}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            // 😶 Aucune variation
                            <motion.div 
                                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/60"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <Settings className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-green-900 mb-3">
                                    {searchTerm ? "Aucune variation trouvée" : "Aucune variation créée"}
                                </h3>
                                <p className="text-green-600/80 mb-6 max-w-md mx-auto">
                                    {searchTerm 
                                        ? "Aucune variation ne correspond à votre recherche. Essayez d'autres termes."
                                        : "Commencez par créer votre première variation pour organiser vos produits"
                                    }
                                </p>
                                {searchTerm ? (
                                    <motion.button
                                        onClick={() => setSearchTerm("")}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition mx-auto shadow-lg shadow-green-500/25"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <span>Réinitialiser la recherche</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={() => setModalOpen(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition mx-auto shadow-lg shadow-green-500/25"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Créer une variation</span>
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </main>
            </div>

            {/* Modal ajout */}
            <VariationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            {/* Modal de confirmation de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                entityName={variationToDelete ? `la variation "${variationToDelete.nom_variation === 'color' ? 'Couleur' : variationToDelete.nom_variation}"` : "cette variation"}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Variations;