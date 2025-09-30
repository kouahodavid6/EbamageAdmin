import { useEffect, useRef, useState } from "react";
import { X, Plus, Edit, Image, Upload } from "lucide-react";
import useCategorieStore from "../../../stores/categorie.store";
import { motion, AnimatePresence } from "framer-motion";

const RegisterCategorieModal = ({ isOpen, onClose, editingCategorie }) => {
    const { addCategorie, updateCategorie } = useCategorieStore();
    const [formData, setFormData] = useState({
        nom_categorie: "",
        image_categorie: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editingCategorie) {
            setFormData({
                nom_categorie: editingCategorie.nom_categorie || "",
                image_categorie: null,
            });
            setPreviewUrl(editingCategorie.image_categorie || null);
        } else {
            setFormData({ nom_categorie: "", image_categorie: null });
            setPreviewUrl(null);
        }
    }, [editingCategorie]);

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
            if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [isOpen, previewUrl]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image_categorie" && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, image_categorie: file }));
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (editingCategorie) {
            await updateCategorie(editingCategorie.hashid, formData);
        } else {
            await addCategorie(formData);
        }

        setLoading(false);
        onClose();
    };

    const handleBackgroundClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setFormData((prev) => ({ ...prev, image_categorie: file }));
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={handleBackgroundClick}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        variants={backdropVariants}
                    />

                    <motion.div
                        ref={modalRef}
                        className="relative z-[10000] bg-white w-full max-w-md rounded-2xl shadow-2xl border border-emerald-100/20"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex items-center justify-between p-6 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {editingCategorie ? (
                                        <Edit className="h-5 w-5 text-white" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-white" />
                                    )}
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900">
                                        {editingCategorie ? "Modifier la catégorie" : "Nouvelle catégorie"}
                                    </h3>
                                    <p className="text-sm text-emerald-600/70">
                                        {editingCategorie ? "Mettez à jour les informations" : "Créez une nouvelle catégorie"}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="text-emerald-400 hover:text-emerald-600 p-2 rounded-xl hover:bg-emerald-50 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Fermer"
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Nom de la catégorie */}
                            <div>
                                <label htmlFor="nom_categorie" className="block text-sm font-semibold text-emerald-800 mb-2">
                                    Nom de la catégorie
                                </label>
                                <motion.input
                                    required
                                    type="text"
                                    name="nom_categorie"
                                    id="nom_categorie"
                                    value={formData.nom_categorie}
                                    onChange={handleChange}
                                    className="w-full border border-emerald-200 rounded-xl px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                    placeholder="Ex: Électronique, Mode, Maison..."
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            {/* Upload d'image */}
                            <div>
                                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                                    Image de la catégorie
                                </label>
                                
                                <motion.div
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                                        isDragging 
                                            ? 'border-emerald-500 bg-emerald-50/50 scale-105' 
                                            : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                                    }`}
                                    onClick={handleImageClick}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="image_categorie"
                                        id="image_categorie"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    
                                    {previewUrl ? (
                                        <motion.div 
                                            className="relative inline-block"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <img
                                                src={previewUrl}
                                                alt="Aperçu"
                                                className="w-32 h-32 object-cover rounded-xl border-2 border-emerald-200 shadow-lg"
                                            />
                                            <div className="absolute inset-0 bg-emerald-900/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Upload className="h-6 w-6 text-white" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex justify-center">
                                                <div className="p-3 rounded-full bg-emerald-100 text-emerald-500">
                                                    <Image className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-emerald-700 font-medium">
                                                    Cliquez ou glissez-déposez une image
                                                </p>
                                                <p className="text-emerald-500 text-sm mt-1">
                                                    PNG, JPG, JPEG jusqu'à 5MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Actions */}
                            <motion.div 
                                className="flex justify-end gap-3 pt-4 border-t border-emerald-100"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Annuler
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            {editingCategorie ? "Modification..." : "Ajout..."}
                                        </div>
                                    ) : (
                                        editingCategorie ? "Modifier" : "Créer la catégorie"
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RegisterCategorieModal;