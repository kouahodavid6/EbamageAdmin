import { useEffect, useRef, useState } from "react";
import { X, Plus, Edit } from "lucide-react";
import useCategorieStore from "../../../stores/categorie.store";

const RegisterCategorieModal = ({ isOpen, onClose, editingCategorie }) => {
    const { addCategorie, updateCategorie } = useCategorieStore();
    const [formData, setFormData] = useState({
        nom_categorie: "",
        image_categorie: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);

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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={handleBackgroundClick}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
                ref={modalRef}
                className="relative z-[10000] bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-200"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-100">
                            {editingCategorie ? (
                                <Edit className="h-5 w-5 text-pink-600" />
                            ) : (
                                <Plus className="h-5 w-5 text-pink-600" />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {editingCategorie ? "Modifier la catégorie" : "Nouvelle catégorie"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nom_categorie" className="block text-sm font-medium text-gray-700">
                            Nom de la catégorie
                        </label>
                        <input
                            required
                            type="text"
                            name="nom_categorie"
                            id="nom_categorie"
                            value={formData.nom_categorie}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="image_categorie" className="block text-sm font-medium text-gray-700">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image_categorie"
                            id="image_categorie"
                            accept="image/*"
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-600 file:bg-pink-600 file:text-white file:px-4 file:py-1 file:rounded-lg file:border-none hover:file:bg-pink-700"
                        />
                        {previewUrl && (
                            <div className="mt-2">
                                <img
                                src={previewUrl}
                                alt="Aperçu"
                                className="w-32 h-32 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
                        >
                            {loading ? (editingCategorie ? "Modification..." : "Ajout...") : (editingCategorie ? "Modifier" : "Ajouter")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterCategorieModal;
