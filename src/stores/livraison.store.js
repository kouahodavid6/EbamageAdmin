// stores/livraison.store.js
import { create } from "zustand";
import { livraisonService } from "../services/livraison.service";

const useLivraisonStore = create((set) => ({
    prixLivraison: null,
    seuilLivraisonGratuite: null,
    loading: false,
    error: null,
    
    // Afficher le prix de livraison
    fetchPrixLivraison: async () => {
        set({ loading: true, error: null });
        try {
            const response = await livraisonService.afficherPrix();
            set({ 
                prixLivraison: response.data,
                loading: false 
            });
            return response;
        } catch (error) {
            set({ 
                error: error.message,
                loading: false 
            });
            throw error;
        }
    },

    // Modifier le prix de livraison
    updatePrixLivraison: async (nouveauPrix) => {
        set({ loading: true, error: null });
        try {
            const response = await livraisonService.modifierPrix(nouveauPrix);
            set({ 
                prixLivraison: response.data,
                loading: false 
            });
            return response;
        } catch (error) {
            set({ 
                error: error.message,
                loading: false 
            });
            throw error;
        }
    },

    // Afficher le seuil de livraison gratuite
    fetchSeuilLivraison: async () => {
        set({ loading: true, error: null });
        try {
            const response = await livraisonService.afficherSeuil();
            set({ 
                seuilLivraisonGratuite: response.data,
                loading: false 
            });
            return response;
        } catch (error) {
            set({ 
                error: error.message,
                loading: false 
            });
            throw error;
        }
    },

    // Modifier le seuil de livraison gratuite
    updateSeuilLivraison: async (nouveauSeuil) => {
        set({ loading: true, error: null });
        try {
            const response = await livraisonService.modifierSeuil(nouveauSeuil);
            set({ 
                seuilLivraisonGratuite: response.data,
                loading: false 
            });
            return response;
        } catch (error) {
            set({ 
                error: error.message,
                loading: false 
            });
            throw error;
        }
    },

    // Réinitialiser les erreurs
    clearError: () => set({ error: null })
}));

export default useLivraisonStore;