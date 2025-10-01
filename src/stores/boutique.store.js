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

    deleteBoutique: async (hashid) => {
        set({ loading: true, error: null });
        try{
            await boutiqueService.deleteBoutiques(hashid);

            set((state) => ({
                boutiques: state.boutiques.filter((boutique) => boutique.hashid !== hashid),
                loading: false,
            }));
        }catch(error) {
            set({ error: error.message, loading: false });
        }
    }
}));

export default useBoutiqueStore;