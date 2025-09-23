import { create } from "zustand";
import { commandeService } from "../services/commande.service";

const useCommandeStore = create((set) => ({
    commande: [],
    loading: false,
    error: null,

    fetchCommandes: async () => {
        set({ loading: true, error: null });
        try {
            const response = await commandeService.getCommandes();
            set({ commandes: response.data || [], loading: false });
        }catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useCommandeStore;