import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import useVariationStore from "../../stores/variation.store";
import VariationModal from "./components/VariationModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const Variations = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [variationToDelete, setVariationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { variations, fetchVariations, deleteVariation } = useVariationStore();

    useEffect(() => {
        fetchVariations();
    }, [fetchVariations]);

    const handleDelete = async () => {
        if (!variationToDelete) return;
        setIsDeleting(true);
        await deleteVariation(variationToDelete.hashid);
        setIsDeleting(false);
        setVariationToDelete(null);
        setDeleteModalOpen(false);
    };

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
                    title="Variations"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">Gestion des variations</h1>
                            <p className="text-gray-600 mt-1 text-xs xs:text-sm sm:text-base">
                                Définissez les types de variations pour vos produits
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedVariation(null);
                                setModalOpen(true);
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-2 transition w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Nouvelle variation</span>
                        </button>
                    </div>

                    {/* Affichage stylisé des variations */}
                    <div className="space-y-4">
                        {variations.map((variation) => (
                            <div
                                key={variation.hashid}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <Settings className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{variation.nom_variation}</h3>
                                        </div>
                                    </div>
                                    <div className="space-x-2">
                                        {/* <button
                                            onClick={() => {
                                                setSelectedVariation(variation);
                                                setModalOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button> */}
                                        <button
                                            onClick={() => {
                                                setVariationToDelete(variation);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Affichage des valeurs */}
                                {variation.valeurs?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Valeurs disponibles:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {variation.valeurs.map((val, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                                >
                                                    {val}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Modal ajout/modification */}
            <VariationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                variationToEdit={selectedVariation}
            />

            {/* Modal suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onCancel={() => {
                setDeleteModalOpen(false);
                setVariationToDelete(null);
                }}
                onConfirm={handleDelete}
                entityName={variationToDelete?.nom_variation}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Variations;