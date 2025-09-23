import { create } from "zustand";
import LocalisationService from "../services/localisation.service";

const useLocalisationStore = create((set) => ({
    villes: [],
    communes: [],
    communesParVille: {},
    loading: false,
    error: null,

ajouterVilles: async () => {
    try {
        set({ loading: true, error: null });
        const res = await LocalisationService.ajouterVilles();
        if (res.success) {
            await useLocalisationStore.getState().fetchVilles();
        }
        return res;
    } catch (error) {
        set({ error: error.message || "Erreur lors de l'ajout des villes" });
        throw error;
    } finally {
        set({ loading: false });
    }
},

ajouterCommunes: async () => {
    try {
        set({ loading: true, error: null });
        const res = await LocalisationService.ajouterCommunes();
        if (res.success) {
            await useLocalisationStore.getState().fetchCommunes();
        }
        return res;
    } catch (error) {
        set({ error: error.message || "Erreur lors de l'ajout des communes" });
        throw error;
    } finally {
        set({ loading: false });
    }
},

fetchVilles: async () => {
    try {
        set({ loading: true, error: null });
        const villes = await LocalisationService.getVilles();
        set({ villes });
    } catch (error) {
        set({ error: error.message || "Erreur lors du chargement des villes" });
    } finally {
        set({ loading: false });
    }
},

fetchCommunes: async () => {
    try {
        set({ loading: true, error: null });
        const communes = await LocalisationService.getCommunes();
        
        // Nouvelle structure de données plus robuste
        const communesParVille = communes.reduce((acc, commune) => {
            const villeId = commune.ville?.hashid;
            if (villeId) {
            if (!acc[villeId]) {
                acc[villeId] = [];
            }
            acc[villeId].push(commune);
            }
            return acc;
        }, {});

        set({ communes, communesParVille });
    } catch (error) {
        console.error("Erreur fetchCommunes:", error);
        set({ error: error.message || "Erreur lors du chargement des communes" });
    } finally {
        set({ loading: false });
    }
},

    fetchCommunesParVille: async (lib_ville, hashidVille) => {
        try {
            set({ loading: true, error: null });
            const result = await LocalisationService.getCommunesParVille(lib_ville);
            
            set((state) => ({
                communesParVille: {
                ...state.communesParVille,
                [hashidVille]: result.communes
                }
            }));
            
            return result.communes;
        } catch (error) {
            console.error("Erreur fetchCommunesParVille:", error);
            set({ error: error.message || `Erreur lors du chargement des communes pour ${lib_ville}` });
            return [];
        } finally {
            set({ loading: false });
        }
    }
}));

export default useLocalisationStore;