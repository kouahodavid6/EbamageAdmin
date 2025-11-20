import { create } from 'zustand';
import { boutiqueArticleService } from "../services/boutiquesArticles.service"

const useBoutiqueArticleStore = create((set) => ({
    articles: [],
    loading: false,
    error: null,
    currentBoutique: null,

    fetchArticlesByBoutique: async (boutiqueHashid, boutiqueData = null) => {
        set({ loading: true, error: null });
        try {
            const response = await boutiqueArticleService.getArticlesByBoutique(boutiqueHashid);
            set({ 
                articles: response.data || [],
                currentBoutique: boutiqueData,
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false,
                articles: [],
                currentBoutique: null
            });
        }
    },

    clearArticles: () => {
        set({ 
            articles: [],
            currentBoutique: null,
            error: null
        });
    }
}));

export default useBoutiqueArticleStore;