import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import useCategorieStore from "../../stores/categorie.store";
import RegisterCategorieModal from "./components/RegisterCategorieModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { Plus, Search, Filter, FolderOpen, Edit, Trash2 } from "lucide-react";

const Categories = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { categories, fetchCategories, deleteCategorie, error } = useCategorieStore();

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

    // Fonction de filtrage des catégories
    const filteredCategories = categories.filter((category) =>
        category.nom_categorie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Overlay mobile */}
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
                {/* Croix mobile */}
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
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

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50 w-full space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des catégories</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                Organisez vos produits par catégories
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setShowAddModal(true);
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Nouvelle catégorie</span>
                        </button>
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
                                    placeholder="Rechercher une catégorie..."
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

                    {/* Affichage des erreurs */}
                    {error && (
                        <p className="text-center text-red-600 font-medium mb-4 text-sm sm:text-base">{error}</p>
                    )}

                    {/* Message si aucune catégorie trouvée */}
                    {filteredCategories.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                {searchTerm ? 
                                    "Aucune catégorie ne correspond à votre recherche" : 
                                    "Aucune catégorie disponible"}
                            </p>
                        </div>
                    )}

                    {/* Grille de catégories */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id || category.hashid}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="h-40 sm:h-48 overflow-hidden">
                                    <img
                                        src={category.image_categorie}
                                        alt={category.nom_categorie}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300x200?text=Image+manquante";
                                        }}
                                    />
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                            {category.nom_categorie}
                                        </h3>
                                        <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            {category.productCount || 0} produits
                                        </span>
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setShowAddModal(true);
                                                }}
                                                className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCategoryToDelete(category);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-1 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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