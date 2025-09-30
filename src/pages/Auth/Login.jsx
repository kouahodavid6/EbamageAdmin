import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { Shield, AlertCircle, Lock } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../../stores/auth.store";
import ContainerForms from "./components/ContainerForms";
import { motion } from "framer-motion";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login, error, clearError, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        try {
            const res = await login(formData);
            console.log("Connexion réussie :", res);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    };

    // Variants d'animation
    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const inputVariants = {
        focus: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    return (
        <ContainerForms>
            {/* HEADER */}
            <motion.div 
                className="w-full flex flex-col items-center py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-2xl mb-4 shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <Shield className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent text-center mb-2">
                    Administration
                </h2>
                <p className="text-emerald-600/80 text-center text-sm font-medium">
                    Accès sécurisé à l'espace administrateur
                </p>
            </motion.div>

            {/* FORMULAIRE */}
            <motion.form 
                onSubmit={handleSubmit} 
                className="mt-8 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Email administrateur <span className="text-red-500">*</span>
                    </label>
                    <motion.div whileFocus="focus" variants={inputVariants}>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@ebamage.com"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 ${
                                error 
                                    ? "border-red-300 bg-red-50 focus:ring-red-200" 
                                    : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                            }`}
                            required
                        />
                    </motion.div>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <motion.div whileFocus="focus" variants={inputVariants}>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 ${
                                error 
                                    ? "border-red-300 bg-red-50 focus:ring-red-200" 
                                    : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                            }`}
                            required
                        />
                    </motion.div>
                </div>

                {/* Affichage des erreurs générales */}
                {error && (
                    <motion.div 
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error}
                        </p>
                    </motion.div>
                )}

                {/* Bouton de soumission */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                        loading 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:from-emerald-600 hover:to-green-600 hover:shadow-emerald-200/50"
                    }`}
                    variants={buttonVariants}
                    whileHover={!loading ? "hover" : {}}
                    whileTap={!loading ? "tap" : {}}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Authentification en cours...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Lock className="w-5 h-5 mr-2" />
                            Accéder à l'espace admin
                        </div>
                    )}
                </motion.button>
            </motion.form>

            {/* LIEN SUPPORT */}
            <motion.div 
                className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <p className="text-center text-sm text-emerald-700">
                    Problème de connexion ?{" "}
                    <Link
                        to="/contact"
                        className="font-semibold text-emerald-600 hover:text-emerald-800 underline transition-colors duration-300"
                    >
                        Contacter le support technique
                    </Link>
                </p>
            </motion.div>

            {/* INDICATEUR DE SÉCURITÉ */}
            <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-500/60">
                    <Shield className="h-3 w-3" />
                    <span>Accès sécurisé • Administration Ebamage</span>
                </div>
            </motion.div>
        </ContainerForms>
    );
};

export default Login;