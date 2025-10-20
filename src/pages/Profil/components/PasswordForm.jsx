import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";
import useAdminInfoStore from "../../../stores/infoAdmin.store";
import toast from "react-hot-toast";

const PasswordForm = () => {
    const [formData, setFormData] = useState({
        ancien_password: "",
        nouveau_password: "",
        nouveau_password_confirmation: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        ancien: false,
        nouveau: false,
        confirmation: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const { updateAdminPassword } = useAdminInfoStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.nouveau_password !== formData.nouveau_password_confirmation) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.nouveau_password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setIsLoading(true);

        try {
            await updateAdminPassword(formData);
            toast.success("Mot de passe mis à jour avec succès !");
            setFormData({
                ancien_password: "",
                nouveau_password: "",
                nouveau_password_confirmation: ""
            });
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur lors de la mise à jour du mot de passe");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const inputVariants = {
        focus: { scale: 1.02, borderColor: "#10b981" },
        blur: { scale: 1, borderColor: "#bbf7d0" }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-6">
                Changer le mot de passe
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ancien mot de passe */}
                <PasswordInput
                    label="Ancien mot de passe"
                    name="ancien_password"
                    value={formData.ancien_password}
                    onChange={handleChange}
                    show={showPasswords.ancien}
                    onToggle={() => togglePasswordVisibility("ancien")}
                    inputVariants={inputVariants}
                />

                {/* Nouveau mot de passe */}
                <PasswordInput
                    label="Nouveau mot de passe"
                    name="nouveau_password"
                    value={formData.nouveau_password}
                    onChange={handleChange}
                    show={showPasswords.nouveau}
                    onToggle={() => togglePasswordVisibility("nouveau")}
                    inputVariants={inputVariants}
                />

                {/* Confirmation mot de passe */}
                <PasswordInput
                    label="Confirmer le nouveau mot de passe"
                    name="nouveau_password_confirmation"
                    value={formData.nouveau_password_confirmation}
                    onChange={handleChange}
                    show={showPasswords.confirmation}
                    onToggle={() => togglePasswordVisibility("confirmation")}
                    inputVariants={inputVariants}
                />

                {/* Bouton */}
                <div className="flex justify-end pt-4 border-t border-green-100">
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors font-medium disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? "Mise à jour..." : "Changer le mot de passe"}</span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

// 🔹 Composant réutilisable pour un champ mot de passe
const PasswordInput = ({ label, name, value, onChange, show, onToggle, inputVariants }) => (
    <div>
        <label className="block text-sm font-medium text-green-700 mb-2">{label}</label>
        <div className="relative">
            <motion.input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors pr-12"
                placeholder={label}
                variants={inputVariants}
                whileFocus="focus"
            />
            <motion.button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.button>
        </div>
    </div>
);

export default PasswordForm;
