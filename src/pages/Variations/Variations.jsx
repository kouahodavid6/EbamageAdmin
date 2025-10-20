import { useEffect, useState } from "react";
import { Plus, Settings } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import useVariationStore from "../../stores/variation.store";
import VariationModal from "./components/VariationModal";

const Variations = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const { variations, fetchVariations, loading } = useVariationStore();

    useEffect(() => {
        fetchVariations();
    }, [fetchVariations]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
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

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-green-900">
                                Gestion des variations
                            </h1>
                            <p className="text-green-600 mt-1 text-xs xs:text-sm sm:text-base">
                                Définissez les types de variations pour vos produits
                            </p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-2 transition w-full sm:w-auto shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Nouvelle variation</span>
                        </button>
                    </div>

                    {/* Liste ou Skeleton */}
                    <div className="space-y-4">
                        {loading ? (
                            // 🦴 Skeleton loader
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl shadow-sm border border-green-100 p-6 animate-pulse"
                                >
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg"></div>
                                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                                    </div>
                                </div>
                            ))
                        ) : variations.length > 0 ? (
                            // ✅ Liste réelle
                            variations.map((variation) => (
                                <div
                                    key={variation.hashid}
                                    className="bg-white rounded-xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Settings className="w-5 h-5 text-green-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-green-900">
                                                {variation.nom_variation}
                                            </h3>
                                        </div>
                                    </div>

                                    {variation.valeurs?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-green-700 mb-2">
                                                Valeurs disponibles :
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {variation.valeurs.map((val, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                                                    >
                                                        {val}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            // 😶 Aucune variation
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Settings className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-green-900 mb-2">
                                    Aucune variation créée
                                </h3>
                                <p className="text-green-600 mb-6">
                                    Commencez par créer votre première variation
                                </p>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition mx-auto"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Créer une variation</span>
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal ajout */}
            <VariationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Variations;
