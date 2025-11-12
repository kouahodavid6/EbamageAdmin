import { motion } from "framer-motion";
import { Store, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const RecentBoutiques = ({ 
    boutiques = [], 
    loading = false, 
    formatDate,
    buttonVariants 
}) => {
    const getRecent = (arr) => {
        const n = arr.length;
        const start = Math.max(n - 3);
        return arr.slice(start, n);
    };

    const recentBoutiques = getRecent(boutiques);
    const skeletonCountBtq = boutiques?.length > 0 ? boutiques.length : 3;

    return (
        <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Store className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-semibold text-emerald-900">
                        Boutiques récentes
                    </h2>
                </div>

                {!loading && boutiques?.length > 0 && (
                    <Link to="/boutiques">
                        <motion.button 
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-all duration-300 text-sm"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Voir toutes
                            <Eye className="w-4 h-4" />
                        </motion.button>
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                {Array(skeletonCountBtq).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <div className="bg-emerald-200 border border-emerald-300 w-10 h-10 rounded-lg mr-3 flex items-center justify-center animate-pulse"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-emerald-200 rounded w-3/4 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-emerald-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {recentBoutiques?.length > 0 ? (
                        recentBoutiques
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((boutique, index) => {
                            const nom = boutique?.nom_btq?.toUpperCase() || "Boutique";
                            const initiale = nom.charAt(0);

                            return (
                                <motion.div 
                                    key={boutique.hashid} 
                                    className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-white transition-all duration-300"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    whileHover={{ x: 5 }}
                                >
                                    {/* Avatar avec initiale */}
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-semibold shadow-lg">
                                            {initiale}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                            <Store className="w-2 h-2 text-white" />
                                        </div>
                                    </div>

                                    {/* Infos boutique */}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-emerald-900 text-sm">
                                            {boutique.nom_btq}
                                        </h4>
                                        <p className="text-xs text-emerald-600/70">
                                            Inscrite le {formatDate ? formatDate(boutique.created_at) : "Date inconnue"}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <Store className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                            <p className="text-emerald-600/70 font-medium">Aucune boutique récente</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default RecentBoutiques;