import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import useCategorieStore from "../../stores/categorie.store";
import RegisterCategorieModal from "./components/RegisterCategorieModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { Plus, Search, Filter, ChartColumnStacked, Edit, Trash2, Layers, Tag } from "lucide-react";
import { motion } from "framer-motion";

const Categories = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { categories, fetchCategories, deleteCategorie, error, loading } = useCategorieStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setDeleting(true);
        await deleteCategorie(categoryToDelete.hashid);
        setDeleting(false);
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    const filteredCategories = categories.filter((category) =>
        category.nom_categorie.toLowerCase().includes(searchTerm.toLowerCase())
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
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        hover: {
            y: -6,
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)",
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/50 flex flex-col md:flex-row">
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
                    title="Catégories"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* Header */}
                    <motion.div 
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                                Gestion des catégories
                            </h1>
                            <p className="text-emerald-600/80">
                                Organisez vos produits par catégories
                            </p>
                        </div>
                        <motion.button
                            onClick={() => {
                                setEditingCategory(null);
                                setShowAddModal(true);
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-emerald-500/25 w-full lg:w-auto justify-center"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Nouvelle catégorie</span>
                        </motion.button>
                    </motion.div>

                    {/* Barre de recherche */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-emerald-400 w-5 h-5" />
                                </div>
                                <motion.input
                                    type="text"
                                    placeholder="Rechercher une catégorie..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>

                            <motion.button 
                                className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all duration-300 whitespace-nowrap font-medium text-emerald-700"
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

                    {/* Affichage des erreurs */}
                    {error && (
                        <motion.div 
                            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <p className="font-medium">{error}</p>
                        </motion.div>
                    )}

                    {/* Message si aucune catégorie trouvée */}
                    {!loading && filteredCategories.length === 0 && (
                        <motion.div 
                            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Layers className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                                {searchTerm ? "Aucune catégorie trouvée" : "Aucune catégorie disponible"}
                            </h3>
                            <p className="text-emerald-600/70">
                                {searchTerm 
                                    ? "Essayez de modifier vos critères de recherche" 
                                    : "Commencez par créer votre première catégorie"
                                }
                            </p>
                        </motion.div>
                    )}

                    {/* Grille de catégories */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {loading
                            ? Array(categories?.length || 6).fill(0).map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden animate-pulse"
                                    variants={itemVariants}
                                >
                                    {/* Skeleton header */}
                                    <div className="h-48 bg-emerald-200/50 w-full animate-pulse" />

                                    {/* Skeleton contenu */}
                                    <div className="p-6 space-y-3">
                                        <div className="h-6 bg-emerald-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-emerald-200 rounded w-1/2 animate-pulse"></div>
                                        <div className="flex gap-2 mt-4">
                                            <div className="flex-1 h-8 bg-emerald-200 rounded animate-pulse"></div>
                                            <div className="flex-1 h-8 bg-emerald-300 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                            : filteredCategories.map((category) => (
                                <motion.div
                                    key={category.id || category.hashid}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden group"
                                    variants={itemVariants}
                                    whileHover="hover"
                                >
                                    {/* Image de la catégorie */}
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={category.image_categorie}
                                            alt={category.nom_categorie}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x200/ecfdf5/10b981?text=Image+manquante";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Contenu de la carte */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-emerald-900 group-hover:text-gray-800 transition-colors">
                                                {category.nom_categorie}
                                            </h3>
                                            <motion.div
                                                whileHover={{ rotate: 15, scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChartColumnStacked className="w-5 h-5 text-emerald-400 group-hover:text-gray-500 transition-colors" />
                                            </motion.div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end pt-4 border-t border-emerald-100">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setShowAddModal(true);
                                                    }}
                                                    className="p-2 text-emerald-400 group-hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => {
                                                        setCategoryToDelete(category);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-2 text-emerald-400 group-hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </main>
            </div>

            {/* Modal d'ajout / modification */}
            <RegisterCategorieModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                editingCategorie={editingCategory}
            />

            {/* Modal de suppression */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                entityName={categoryToDelete?.nom_categorie}
                isDeleting={deleting}
            />
        </div>
    );
};

export default Categories;
