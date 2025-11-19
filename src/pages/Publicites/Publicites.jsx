// src/pages/Dashboard/PublicitesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Plus,
  Upload,
  X
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import usePubliciteStore from "../../stores/publicites.store";
import toast from "react-hot-toast";

const Publicites = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    publicite: null,
    isDeleting: false
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    publicite: null,
    selectedImage: null,
    imagePreview: null,
    isUpdating: false
  });

  // Store
  const { 
    publicites, 
    fetchPublicites, 
    deletePublicite, 
    updatePublicite,
    loading,
    success,
    error,
    clearState
  } = usePubliciteStore();

  // Charger les publicités
  useEffect(() => {
    fetchPublicites();
  }, [fetchPublicites]);

  // Gérer les toasts
  useEffect(() => {
    if (success) {
      toast.success('Opération réussie !');
      clearState();
      fetchPublicites();
      closeEditModal();
    }
    if (error) {
      toast.error(error);
      clearState();
    }
  }, [success, error, clearState, fetchPublicites]);

  // Supprimer une publicité
  const handleDelete = async () => {
    if (!deleteModal.publicite) return;
    
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await deletePublicite(deleteModal.publicite.id);
      setDeleteModal({ isOpen: false, publicite: null, isDeleting: false });
    } catch (error) {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Ouvrir modal d'édition
  const openEditModal = (publicite) => {
    setEditModal({
      isOpen: true,
      publicite,
      selectedImage: null,
      imagePreview: { url: publicite.image_pub, name: 'Image actuelle' },
      isUpdating: false
    });
  };

  // Fermer modal d'édition
  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      publicite: null,
      selectedImage: null,
      imagePreview: null,
      isUpdating: false
    });
  };

  // Gérer la sélection d'image pour l'édition
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image dépasse la taille maximale de 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    setEditModal(prev => ({
      ...prev,
      selectedImage: file
    }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditModal(prev => ({
        ...prev,
        imagePreview: {
          url: e.target.result,
          name: file.name
        }
      }));
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  };

  // Effacer l'image sélectionnée
  const clearEditImage = () => {
    setEditModal(prev => ({
      ...prev,
      selectedImage: null,
      imagePreview: { url: prev.publicite.image_pub, name: 'Image actuelle' }
    }));
  };

  // Mettre à jour une publicité - CORRIGÉ AVEC DÉBOGAGE
// Dans handleUpdatePublicite - REMPLACER CE BLOC
const handleUpdatePublicite = async () => {
  if (!editModal.publicite) {
    toast.error('Aucune publicité sélectionnée');
    return;
  }

  if (!editModal.selectedImage) {
    toast.error('Veuillez sélectionner une nouvelle image');
    return;
  }

  setEditModal(prev => ({ ...prev, isUpdating: true }));

  try {
    const formData = new FormData();
    
    // L'API attend un tableau d'images, même pour une seule image
    // On crée un tableau avec un seul élément
    formData.append('images[]', editModal.selectedImage);
    
    console.log('Envoi de la mise à jour avec tableau images[]:', {
      hashid: editModal.publicite.id,
      file: editModal.selectedImage.name,
      fileSize: editModal.selectedImage.size
    });

    await updatePublicite(editModal.publicite.id, formData);
    
  } catch (error) {
    console.error('Erreur détaillée lors de la mise à jour:', error);
    toast.error(`Erreur: ${error.message}`);
    setEditModal(prev => ({ ...prev, isUpdating: false }));
  }
};

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Squelette de chargement
  const SkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-4 animate-pulse">
      <div className="aspect-[4/3] bg-emerald-200 rounded-xl mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
        <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-emerald-200 rounded flex-1"></div>
        <div className="h-10 bg-emerald-200 rounded flex-1"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 w-64 h-screen`}
      >
        <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
            aria-label="Fermer la sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <DashboardSidebar/>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          title="Gestion des Publicités"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent">
          {/* En-tête avec bouton retour et statistiques */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <motion.button
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-emerald-100/60 text-emerald-600 hover:text-emerald-800 transition-all duration-300"
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-emerald-900">
                    Publicités Clients
                  </h1>
                  <p className="text-emerald-600/70">
                    {publicites.length} publicité{publicites.length !== 1 ? 's' : ''} au total
                  </p>
                </div>
              </div>
              
              <Link to="/dashboard">
                <motion.button
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg transition-all duration-300 w-full lg:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle Publicité
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Liste des publicités */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              // Grille de squelettes de chargement - 3 par ligne
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : publicites.length === 0 ? (
              // Aucune publicité
              <motion.div
                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
                variants={itemVariants}
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Image className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                  Aucune publicité
                </h3>
                <p className="text-emerald-600/70 mb-8 max-w-md mx-auto">
                  Commencez par créer votre première publicité pour vos clients.
                </p>
                <Link to="/dashboard">
                  <motion.button
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                    Créer une publicité
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              // Grille des publicités - 3 par ligne sur grand écran
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {publicites.map((publicite, index) => (
                    <motion.div
                      key={publicite.id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      {/* En-tête de la carte */}
                      <div className="p-4 border-b border-emerald-100/60">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">
                            Publicité
                          </div>
                          <div className="text-xs text-emerald-400">
                            #{index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={publicite.image_pub}
                          alt={`Publicité ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        
                        {/* Overlay d'actions au hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => openEditModal(publicite)}
                              className="bg-white/90 backdrop-blur-sm text-emerald-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => setDeleteModal({ 
                                isOpen: true, 
                                publicite, 
                                isDeleting: false 
                              })}
                              className="bg-white/90 backdrop-blur-sm text-red-600 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Actions (visibles sur mobile) */}
                      <div className="p-4 mt-auto lg:hidden">
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => openEditModal(publicite)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Edit3 className="w-4 h-4" />
                            Modifier
                          </motion.button>
                          
                          <motion.button
                            onClick={() => setDeleteModal({ 
                              isOpen: true, 
                              publicite, 
                              isDeleting: false 
                            })}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Indicateur de résultats */}
          {!loading && publicites.length > 0 && (
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-emerald-600/70 text-sm">
                Affichage de {publicites.length} publicité{publicites.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal de suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, publicite: null, isDeleting: false })}
        entityName="cette publicité"
        isDeleting={deleteModal.isDeleting}
      />

      {/* Modal d'édition */}
      <AnimatePresence>
        {editModal.isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeEditModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100/20"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">
                    Modifier la publicité
                  </h3>
                  <p className="text-emerald-600/70 text-sm mt-1">
                    Mettez à jour l'image de la publicité
                  </p>
                </div>
                <motion.button
                  onClick={closeEditModal}
                  className="p-2 rounded-xl text-emerald-400 hover:text-emerald-600 hover:bg-white transition-all duration-200"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-6">
                {/* Image actuelle */}
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Image actuelle
                  </p>
                  <div className="bg-gray-100 rounded-xl overflow-hidden border border-emerald-200">
                    <img
                      src={editModal.publicite.image_pub}
                      alt="Image actuelle"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                </div>

                {/* Nouvelle image */}
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Nouvelle image
                  </p>
                  <motion.div
                    className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center bg-emerald-50/50 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
                    onClick={() => document.getElementById('edit-image-upload').click()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      id="edit-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    
                    {editModal.imagePreview ? (
                      <div className="space-y-6">
                        <div className="relative bg-white rounded-xl border border-emerald-200 overflow-hidden max-w-md mx-auto">
                          <img 
                            src={editModal.imagePreview.url} 
                            alt="Preview"
                            className="w-full h-48 object-contain"
                          />
                          <div className="p-4">
                            <p className="text-sm text-emerald-600 font-medium truncate">
                              {editModal.imagePreview.name}
                            </p>
                            {editModal.selectedImage && (
                              <p className="text-xs text-emerald-500 mt-1">
                                {(editModal.selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                          {editModal.selectedImage && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearEditImage();
                              }}
                              className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 shadow-lg"
                              whileHover={{ scale: 1.1 }}
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('edit-image-upload').click();
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-300 transition-all duration-300"
                          >
                            <Upload className="w-4 h-4" />
                            Changer l'image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-emerald-700 font-semibold text-lg">
                            Cliquez pour sélectionner une image
                          </p>
                          <p className="text-emerald-600/70 text-sm mt-2">
                            Formats supportés: JPG, PNG, GIF, WEBP
                          </p>
                          <p className="text-emerald-500/60 text-xs mt-1">
                            Taille maximale: 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-emerald-100">
                  <motion.button
                    onClick={closeEditModal}
                    className="flex-1 py-4 border border-emerald-300 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-all duration-300"
                    disabled={editModal.isUpdating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    onClick={handleUpdatePublicite}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    disabled={!editModal.selectedImage || editModal.isUpdating}
                    whileHover={!editModal.isUpdating && { scale: 1.02 }}
                    whileTap={!editModal.isUpdating && { scale: 0.98 }}
                  >
                    {editModal.isUpdating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-5 h-5" />
                        Mettre à jour la publicité
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Publicites;