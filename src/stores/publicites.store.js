import { create } from 'zustand';
import { publicitesService } from '../services/publicites.service';

const usePubliciteStore = create((set) => ({
    loading: false,
    error: null,
    success: false,

    // Envoyer une publicité aux clients
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

    // Réinitialiser les états
    clearState: () => set({ error: null, success: false })
}));

export default usePubliciteStore;