import { useState } from "react";
import { Plus, X } from "lucide-react";
import useVariationStore from "../../../stores/variation.store";

const VariationModal = ({ isOpen, onClose }) => {
    const { addVariation } = useVariationStore();
    const [nom_variation, setNomVariation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nom_variation.trim()) return;

        setIsLoading(true);
        const payload = { nom_variation: nom_variation.trim() };

        try {
            await addVariation(payload);
            setNomVariation("");
            onClose();
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bouton croix */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header avec style vert */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-green-100">
                        <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-green-900">
                            Nouvelle variation
                        </h2>
                        <p className="text-green-600 text-sm mt-1">
                            Créez un nouveau type de variation
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de la variation <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nom_variation}
                            onChange={(e) => setNomVariation(e.target.value)}
                            required
                            placeholder="Ex: Couleur, Taille, Matériau..."
                            className="w-full border border-green-200 rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors placeholder-green-300 text-green-900"
                            disabled={isLoading}
                        />
                        <p className="text-green-600 text-xs mt-2">
                            Ce nom identifiera le type de variation dans votre boutique
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-green-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !nom_variation.trim()}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariationModal;