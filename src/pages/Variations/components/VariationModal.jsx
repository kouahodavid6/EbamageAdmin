import { useEffect, useState } from "react";
import { Plus, Edit, X } from "lucide-react";
import useVariationStore from "../../../stores/variation.store";

const VariationModal = ({ isOpen, onClose, variationToEdit }) => {
    const { addVariation, editVariation } = useVariationStore();
    const [nom_variation, setNomVariation] = useState("");

    useEffect(() => {
        if (variationToEdit) {
            setNomVariation(variationToEdit.nom_variation);
        } else {
            setNomVariation("");
        }
    }, [variationToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { nom_variation };

        if (variationToEdit) {
            await editVariation(variationToEdit.hashid, payload);
        } else {
            await addVariation(payload);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bouton croix */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-red-100">
                        {variationToEdit ? (
                            <Edit className="text-pink-600" />
                        ) : (
                            <Plus className="text-pink-600" />
                        )}
                    </div>
                    <h2 className="text-lg font-semibold">
                        {variationToEdit ? "Modifier la" : "Ajouter une"} variation
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nom de la variation
                        </label>
                        <input
                            type="text"
                            value={nom_variation}
                            onChange={(e) => setNomVariation(e.target.value)}
                            required
                            className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                            {variationToEdit ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariationModal;