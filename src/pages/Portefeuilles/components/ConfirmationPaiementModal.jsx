import { X, CheckCircle, AlertCircle, Smartphone, CreditCard, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmationPaiementModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    onSuccess,
    reclamation,
    loading = false 
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleConfirm = async () => {
        try {
            await onConfirm(reclamation.hashid);
            
            // Fermer le modal
            onClose();
            
            // Appeler la fonction de succès après un court délai
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(`Paiement confirmé pour ${reclamation.nom_boutique}`);
                }
            }, 500);
            
        } catch (error) {
            console.error('Erreur lors de la confirmation:', error);
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: -20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && reclamation && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    {/* Overlay avec backdrop blur */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={!loading ? onClose : undefined}
                        aria-hidden="true"
                        variants={backdropVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-emerald-100/20 max-h-[85vh] flex flex-col"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-emerald-100 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <CreditCard className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900">
                                        Confirmer le Paiement
                                    </h3>
                                    <p className="text-sm text-emerald-600/70">
                                        Validation de transaction
                                    </p>
                                </div>
                            </div>
                            {!loading && (
                                <motion.button
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Fermer la fenêtre"
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            )}
                        </div>

                        {/* Contenu scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {/* Informations de la boutique */}
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span className="font-semibold text-emerald-900">Boutique à payer</span>
                                        </div>
                                        <p className="text-emerald-700 font-medium">
                                            {reclamation.nom_boutique || 'Boutique sans nom'}
                                        </p>
                                        <p className="text-sm text-emerald-600">
                                            Tél: {reclamation.tel_boutique || 'Non renseigné'}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Détails du paiement */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="space-y-3"
                                >
                                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                                        <span className="text-emerald-600">Montant à payer:</span>
                                        <span className="font-bold text-emerald-900 text-lg">
                                            {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'XOF',
                                                minimumFractionDigits: 0
                                            }).format(reclamation.montant || 0)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                                        <span className="text-emerald-600">Code commande:</span>
                                        <span className="font-medium text-emerald-900">
                                            {reclamation.code_commande}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Instructions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div className="space-y-2">
                                                <p className="text-blue-800 font-medium text-sm">
                                                    Vérifiez avant de confirmer :
                                                </p>
                                                <ul className="text-blue-700 text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                                        Vous avez effectué le paiement manuellement
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                                        Via votre téléphone (Wave, OM, etc.)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                                        Le montant correspond exactement
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Message d'avertissement */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-yellow-700 text-sm">
                                            Cette action marquera la réclamation comme payée et ne pourra pas être annulée.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Actions fixes en bas */}
                        <motion.div 
                            className="flex gap-3 p-6 border-t border-emerald-100 flex-shrink-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {!loading && (
                                <motion.button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium transition-all duration-300 min-w-24"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Annuler
                                </motion.button>
                            )}
                            <motion.button
                                onClick={handleConfirm}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-24 flex items-center justify-center flex-1"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {loading ? (
                                    <motion.div 
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Confirmation...
                                    </motion.div>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Confirmer le Paiement
                                    </motion.span>
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationPaiementModal;