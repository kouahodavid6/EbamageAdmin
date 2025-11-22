// components/ModifierPrixModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Package, Percent } from "lucide-react";

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
        if (isOpen && valeurActuelle !== undefined && valeurActuelle !== null) {
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
            placeholder: "Entrez le nouveau prix de livraison",
            icon: Package,
            color: "emerald",
            suffix: "FCFA",
            formatValue: (val) => val?.toLocaleString("fr-FR")
        },
        seuil: {
            title: "Modifier le seuil de livraison gratuite",
            label: "Seuil de livraison gratuite (FCFA)",
            placeholder: "Entrez le nouveau seuil pour la livraison gratuite",
            icon: Package,
            color: "emerald",
            suffix: "FCFA",
            formatValue: (val) => val?.toLocaleString("fr-FR")
        },
        pourcentage: {
            title: "Modifier le pourcentage de réduction",
            label: "Pourcentage de réduction (%)",
            placeholder: "Entrez le nouveau pourcentage",
            icon: Percent,
            color: "emerald",
            suffix: "%",
            formatValue: (val) => val ? `${val}%` : "0%"
        }
    }[type];

    const colorClasses = {
        emerald: {
            bg: "bg-emerald-100",
            text: "text-emerald-600",
            border: "border-emerald-200",
            focus: "focus:ring-emerald-500 focus:border-emerald-500",
            inputBg: "bg-emerald-50/50"
        },
    }[config.color];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
                {/* En-tête */}
                <div className={`flex items-center justify-between p-6 border-b ${colorClasses.border}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${colorClasses.bg} rounded-xl`}>
                            <config.icon className={`w-5 h-5 ${colorClasses.text}`} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
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
                        <label className={`block text-sm font-medium ${colorClasses.text} mb-2`}>
                            {config.label}
                        </label>
                        <input
                            type="number"
                            value={nouvelleValeur}
                            onChange={(e) => setNouvelleValeur(e.target.value)}
                            placeholder={config.placeholder}
                            className={`w-full px-4 py-3 border ${colorClasses.border} rounded-xl focus:outline-none focus:ring-2 ${colorClasses.focus} transition-all duration-200 ${colorClasses.inputBg}`}
                            min="0"
                            max={type === 'pourcentage' ? 100 : undefined}
                            required
                        />
                        <p className={`text-sm ${colorClasses.text} mt-2`}>
                            Valeur actuelle: <span className="font-semibold">
                                {config.formatValue ? config.formatValue(valeurActuelle) : valeurActuelle} {config.suffix}
                            </span>
                        </p>
                        {type === 'pourcentage' && (
                            <p className="text-xs text-gray-500 mt-1">
                                Le pourcentage doit être compris entre 0 et 100%
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className={`flex-1 px-4 py-3 ${colorClasses.text} font-medium ${colorClasses.bg} hover:opacity-80 rounded-xl transition-all duration-200 border ${colorClasses.border}`}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !nouvelleValeur || isNaN(nouvelleValeur)}
                            className={`flex-1 px-4 py-3 bg-gradient-to-r ${
                                type === 'pourcentage' 
                                    ? 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
                                    : 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                            } disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed`}
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