// components/ModifierPrixModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Package } from "lucide-react";

const ModifierPrixModal = ({ 
    isOpen, 
    onClose, 
    type, 
    valeurActuelle, 
    onModifier,
    loading = false 
}) => {
    const [nouvelleValeur, setNouvelleValeur] = useState("");

    useEffect(() => {
        if (isOpen && valeurActuelle) {
            setNouvelleValeur(valeurActuelle.toString());
        }
    }, [isOpen, valeurActuelle]);

    const resetForm = () => {
        setNouvelleValeur("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nouvelleValeur || isNaN(nouvelleValeur)) {
            return;
        }

        try {
            await onModifier(parseInt(nouvelleValeur));
            handleClose();
        } catch (error) {
            // L'erreur est gérée par le store
        }
    };

    if (!isOpen) return null;

    const config = {
        prix: {
            title: "Modifier le prix de livraison",
            label: "Prix de livraison (FCFA)",
            placeholder: "Entrez le nouveau prix de livraison"
        },
        seuil: {
            title: "Modifier le seuil de livraison gratuite",
            label: "Seuil de livraison gratuite (FCFA)",
            placeholder: "Entrez le nouveau seuil pour la livraison gratuite"
        }
    }[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-xl">
                            <Package className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-emerald-900">
                            {config.title}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenu */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                            {config.label}
                        </label>
                        <input
                            type="number"
                            value={nouvelleValeur}
                            onChange={(e) => setNouvelleValeur(e.target.value)}
                            placeholder={config.placeholder}
                            className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-emerald-50/50"
                            min="0"
                            required
                        />
                        <p className="text-sm text-emerald-600 mt-2">
                            Valeur actuelle: <span className="font-semibold">{valeurActuelle?.toLocaleString("fr-FR")} FCFA</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-emerald-600 font-medium bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-200 border border-emerald-200"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !nouvelleValeur || isNaN(nouvelleValeur)}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Modification...
                                </div>
                            ) : (
                                "Modifier"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ModifierPrixModal;