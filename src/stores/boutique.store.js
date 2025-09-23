import { create } from 'zustand';
import { boutiqueService } from '../services/boutique.service';

const useBoutiqueStore = create((set) => ({
    boutiques: [],
    loading: false,
    error: null,

    fetchBoutiques: async () => {
        set({ loading: true, error: null });
        try {
            const response = await boutiqueService.getBoutiques();
            set({ boutiques: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useBoutiqueStore;