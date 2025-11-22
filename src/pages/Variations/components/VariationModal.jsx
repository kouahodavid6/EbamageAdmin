import { useState, useEffect } from "react";
import { Plus, X, Edit3 } from "lucide-react";
import useVariationStore from "../../../stores/variation.store";

const VariationModal = ({ isOpen, onClose, variationToEdit = null }) => {
    const { addVariation, updateVariation } = useVariationStore();
    const [nom_variation, setNomVariation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens/closes or when variationToEdit changes
    useEffect(() => {
        if (isOpen) {
            if (variationToEdit) {
                setNomVariation(variationToEdit.nom_variation === 'color' ? 'Couleur' : variationToEdit.nom_variation);
            } else {
                setNomVariation("");
            }
        }
    }, [isOpen, variationToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nom_variation.trim()) return;

        setIsLoading(true);
        const payload = { 
            nom_variation: variationToEdit && variationToEdit.nom_variation === 'color' 
                ? 'color' 
                : nom_variation.trim().toLowerCase() 
        };

        try {
            if (variationToEdit) {
                await updateVariation(variationToEdit.hashid, payload);
            } else {
                await addVariation(payload);
            }
            setNomVariation("");
            onClose();
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const isEditMode = !!variationToEdit;
    const isColorVariation = variationToEdit?.nom_variation === 'color';

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
                    <div className={`p-2 rounded-full ${isEditMode ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {isEditMode ? (
                            <Edit3 className="w-5 h-5 text-blue-600" />
                        ) : (
                            <Plus className="w-5 h-5 text-green-600" />
                        )}
                    </div>
                    <div>
                        <h2 className={`text-xl font-semibold ${isEditMode ? 'text-blue-900' : 'text-green-900'}`}>
                            {isEditMode ? 'Modifier la variation' : 'Nouvelle variation'}
                        </h2>
                        <p className={`text-sm mt-1 ${isEditMode ? 'text-blue-600' : 'text-green-600'}`}>
                            {isEditMode 
                                ? 'Modifiez le type de variation' 
                                : 'Créez un nouveau type de variation'
                            }
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
                            className={`w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:border transition-colors placeholder-green-300 ${
                                isEditMode 
                                    ? 'border-blue-200 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50 text-blue-900' 
                                    : 'border-green-200 focus:ring-green-500 focus:border-green-500 bg-green-50/50 text-green-900'
                            }`}
                            disabled={isLoading || isColorVariation}
                        />
                        {isColorVariation && (
                            <p className="text-amber-600 text-xs mt-2 font-medium">
                                ⚠️ La variation "Couleur" est requise et ne peut pas être modifiée
                            </p>
                        )}
                        <p className={`text-xs mt-2 ${
                            isEditMode ? 'text-blue-600' : 'text-green-600'
                        }`}>
                            {isEditMode 
                                ? 'Ce nom identifiera le type de variation dans votre boutique'
                                : 'Ce nom identifiera le type de variation dans votre boutique'
                            }
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
                            disabled={isLoading || !nom_variation.trim() || isColorVariation}
                            className={`px-6 py-3 text-white rounded-xl focus:ring-2 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                                isEditMode
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-500/25'
                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-lg shadow-green-500/25'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {isEditMode ? 'Modification...' : 'Création...'}
                                </>
                            ) : (
                                isEditMode ? 'Modifier' : 'Créer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariationModal;