import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ModalCommune = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  commune = null, 
  selectedVille = null,
  villes = [], 
  loading, 
  error 
}) => {
  const [communeForm, setCommuneForm] = useState({ lib_commune: "", id_ville_hash: "" });
  const [localError, setLocalError] = useState("");

  const isEditMode = Boolean(commune);

  useEffect(() => {
    if (isOpen) {
      if (commune) {
        // Mode édition - pré-remplir avec les données de la commune
        setCommuneForm({ 
          lib_commune: commune.lib_commune, 
          id_ville_hash: commune.ville?.hashid || "" 
        });
      } else if (selectedVille) {
        // Mode ajout avec ville présélectionnée
        setCommuneForm({ 
          lib_commune: "", 
          id_ville_hash: selectedVille.hashid 
        });
      } else {
        // Mode ajout sans ville présélectionnée
        setCommuneForm({ lib_commune: "", id_ville_hash: "" });
      }
      setLocalError("");
    }
  }, [isOpen, commune, selectedVille]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!communeForm.lib_commune.trim()) {
      setLocalError("Le nom de la commune est requis");
      return;
    }

    if (!communeForm.id_ville_hash) {
      setLocalError("Veuillez sélectionner une ville");
      return;
    }

    try {
      if (isEditMode) {
        // Mode édition
        await onSubmit(commune.hashid, communeForm.lib_commune.trim(), communeForm.id_ville_hash);
      } else {
        // Mode ajout
        await onSubmit(communeForm.lib_commune.trim(), communeForm.id_ville_hash);
      }
    } catch (err) {
      console.error("Erreur dans le modal:", err);
    }
  };

  const handleClose = () => {
    setCommuneForm({ lib_commune: "", id_ville_hash: "" });
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
                {isEditMode 
                  ? "Modifier la commune" 
                  : selectedVille 
                    ? `Ajouter une commune à ${selectedVille.lib_ville}`
                    : "Ajouter une commune"
                }
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
                <label htmlFor="lib_commune" className="block text-sm font-medium text-emerald-700 mb-2">
                  Nom de la commune *
                </label>
                <input
                  type="text"
                  id="lib_commune"
                  value={communeForm.lib_commune}
                  onChange={(e) => setCommuneForm(prev => ({ ...prev, lib_commune: e.target.value }))}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Exemple: Cocody"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="id_ville_hash" className="block text-sm font-medium text-emerald-700 mb-2">
                  Ville *
                </label>
                <select
                  id="id_ville_hash"
                  value={communeForm.id_ville_hash}
                  onChange={(e) => setCommuneForm(prev => ({ ...prev, id_ville_hash: e.target.value }))}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={loading || (selectedVille && !isEditMode)} // Désactivé si ville présélectionnée en mode ajout
                >
                  <option value="">Sélectionnez une ville</option>
                  {villes.map(ville => (
                    <option key={ville.hashid} value={ville.hashid}>
                      {ville.lib_ville}
                    </option>
                  ))}
                </select>
                {selectedVille && !isEditMode && (
                  <p className="text-sm text-emerald-600 mt-1">
                    La commune sera ajoutée à <strong>{selectedVille.lib_ville}</strong>
                  </p>
                )}
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
                      : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-teal-500/25"
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

export default ModalCommune;