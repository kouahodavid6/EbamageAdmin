import { pourcentageService } from "../services/pourcentage.service";
import { create } from "zustand";

const usePourcentageStore = create((set) => ({
    pourcentage: null,
    loading: false,
    error: null,

    readPourcentage: async () => {
        set({ loading: true, error: null });

        try {
            const response = await pourcentageService.readPourcentage();
            set({ 
                pourcentage: response.data,
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

    updatePourcentage: async (newPourcentage) => {
        set({ loading: true, error: null });

        try {
            const response = await pourcentageService.updatePourcentage(newPourcentage);
            set({
                pourcentage: response.data,
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
    }
}));

export default usePourcentageStore;