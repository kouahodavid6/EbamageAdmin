import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Edit } from "lucide-react";
import useAdminInfoStore from "../../../stores/infoAdmin.store";

const InfoForm = ({ admin, loading }) => {
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
    });
    const [initialData, setInitialData] = useState({
        nom: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const { updateAdminInfo } = useAdminInfoStore();

    // ✅ Charger les infos de l’admin dès qu’elles changent
    useEffect(() => {
        if (admin) {
            const newData = {
                nom: admin.nom || "",
                email: admin.email || "",
            };
            setFormData(newData);
            setInitialData(newData);
        }
    }, [admin]);

    // ✅ Détecter automatiquement les changements
    useEffect(() => {
        const formChanged =
            formData.nom !== initialData.nom ||
            formData.email !== initialData.email;
        setHasChanges(formChanged);
    }, [formData, initialData]);

    // ✅ Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        setIsLoading(true);
        try {
            await updateAdminInfo(formData);
            setInitialData(formData); // Actualiser la référence
            setHasChanges(false);
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Gérer les changements de champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Annuler la modification
    const handleCancel = () => {
        setFormData(initialData);
        setHasChanges(false);
        setIsEditing(false);
    };

    // ✅ Variantes d’animation des champs
    const inputVariants = {
        focus: { scale: 1.02, borderColor: "#10b981" },
        blur: { scale: 1, borderColor: "#bbf7d0" },
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-green-900">
                    Informations
                </h2>
                <motion.button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                        isEditing
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Edit className="w-4 h-4" />
                    <span>{isEditing ? "Annuler" : "Modifier"}</span>
                </motion.button>
            </div>

            {/* Mode lecture seule */}
            {!isEditing ? (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Nom
                        </label>
                        <p className="text-green-900 font-semibold">
                            {formData.nom || "—"}
                        </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Email
                        </label>
                        <p className="text-green-900 font-semibold">
                            {formData.email || "—"}
                        </p>
                    </div>
                </div>
            ) : (
                // Mode édition
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Champ Nom */}
                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            Nom
                        </label>
                        {loading ? (
                            <div className="h-12 bg-green-100 rounded-xl animate-pulse"></div>
                        ) : (
                            <motion.input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                                placeholder="Nom complet"
                                variants={inputVariants}
                                whileFocus="focus"
                            />
                        )}
                    </div>

                    {/* Champ Email */}
                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            Email
                        </label>
                        {loading ? (
                            <div className="h-12 bg-green-100 rounded-xl animate-pulse"></div>
                        ) : (
                            <motion.input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                                placeholder="email@exemple.com"
                                variants={inputVariants}
                                whileFocus="focus"
                            />
                        )}
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-green-100">
                        <motion.button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Annuler
                        </motion.button>

                        <motion.button
                            type="submit"
                            disabled={isLoading || !hasChanges}
                            className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors font-medium ${
                                hasChanges
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            } ${isLoading ? "opacity-50" : ""}`}
                            whileHover={hasChanges ? { scale: 1.02 } : {}}
                            whileTap={hasChanges ? { scale: 0.98 } : {}}
                        >
                            <Save className="w-4 h-4" />
                            <span>{isLoading ? "Mise à jour..." : "Enregistrer"}</span>
                        </motion.button>
                    </div>

                    {/* Indicateur de changements */}
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-3"
                        >
                            <p className="text-blue-700 text-sm flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Modifications non enregistrées
                            </p>
                        </motion.div>
                    )}
                </form>
            )}
        </div>
    );
};

export default InfoForm;
