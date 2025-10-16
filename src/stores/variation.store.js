import { create } from "zustand";
import toast from "react-hot-toast";
import VariationService from "../services/variation.service";

const useVariationStore = create((set) => ({
    variations: [],
    loading: false,

    addVariation: async (data) => {
        try {
            const res = await VariationService.ajouterVariation(data);
            toast.success(res.message || "Variation ajoutée !");
            set((state) => ({
                variations: [...state.variations, res.data],
            }));
        } catch (error) {
            toast.error(error.message || "Erreur lors de l'ajout.");
        }
    },

    fetchVariations: async () => {
        set({ loading: true });
        try {
            const data = await VariationService.listerVariations();
            set({ variations: data });
        } catch (error) {
            toast.error(error.message || "Erreur lors du chargement des variations.");
        } finally {
            set({ loading: false });
        }
    },
}));

export default useVariationStore;