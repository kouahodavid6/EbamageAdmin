// src/stores/publicites.store.js
import { create } from 'zustand';
import { publicitesService } from '../services/publicites.service';

const usePubliciteStore = create((set) => ({
    loading: false,
    error: null,
    success: false,
    publicites: [],

    // Envoyer une publicité aux clients (UNE SEULE IMAGE)
    sendToClients: async (formData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await publicitesService.sendToClients(formData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Récupérer toutes les publicités clients
    fetchPublicites: async () => {
        set({ loading: true, error: null });
        try {
            const response = await publicitesService.getPublicitesClients();
            set({ publicites: response.data, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Modifier une publicité
    updatePublicite: async (hashid, formData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await publicitesService.updatePublicite(hashid, formData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Supprimer une publicité
    deletePublicite: async (hashid) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await publicitesService.deletePublicite(hashid);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Réinitialiser les états
    clearState: () => set({ error: null, success: false })
}));

export default usePubliciteStore;