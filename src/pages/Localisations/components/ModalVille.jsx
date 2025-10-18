import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ModalVille = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  ville = null, 
  loading, 
  error 
}) => {
  const [villeForm, setVilleForm] = useState({ lib_ville: "" });
  const [localError, setLocalError] = useState("");

  const isEditMode = Boolean(ville);

  useEffect(() => {
    if (isOpen) {
      if (ville) {
        // Mode édition - pré-remplir avec les données de la ville
        setVilleForm({ lib_ville: ville.lib_ville });
      } else {
        // Mode ajout - formulaire vide
        setVilleForm({ lib_ville: "" });
      }
      setLocalError("");
    }
  }, [isOpen, ville]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!villeForm.lib_ville.trim()) {
      setLocalError("Le nom de la ville est requis");
      return;
    }

    try {
      if (isEditMode) {
        // Mode édition
        await onSubmit(ville.hashid, villeForm.lib_ville.trim());
      } else {
        // Mode ajout
        await onSubmit(villeForm.lib_ville.trim());
      }
    } catch (err) {
      console.error("Erreur dans le modal:", err);
    }
  };

  const handleClose = () => {
    setVilleForm({ lib_ville: "" });
    setLocalError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-emerald-100">
              <h3 className="text-xl font-semibold text-emerald-900">
                {isEditMode ? "Modifier la ville" : "Ajouter une ville"}
              </h3>
              <button 
                onClick={handleClose} 
                className="text-emerald-600 hover:text-emerald-800 transition-colors duration-200" 
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {localError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {localError}
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="lib_ville" className="block text-sm font-medium text-emerald-700 mb-2">
                  Nom de la ville *
                </label>
                <input
                  type="text"
                  id="lib_ville"
                  value={villeForm.lib_ville}
                  onChange={(e) => setVilleForm({ lib_ville: e.target.value })}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Exemple: Abidjan"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-lg disabled:opacity-50 ${
                    isEditMode 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/25"
                  }`}
                >
                  {loading 
                    ? isEditMode ? "Modification..." : "Ajout..." 
                    : isEditMode ? "Modifier" : "Ajouter"
                  }
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalVille;