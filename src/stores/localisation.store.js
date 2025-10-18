import { create } from "zustand";
import LocalisationService from "../services/localisation.service";

const useLocalisationStore = create((set, get) => ({
    villes: [],
    communes: [],
    communesParVille: {},
    loading: false,
    error: null,

    // Ajouter une ville
    ajouterVille: async (lib_ville) => {
        try {
            set({ loading: true, error: null });
            const res = await LocalisationService.ajouterVille(lib_ville);
            if (res.success) {
                await get().fetchVilles();
                await get().fetchCommunes();
            }
            return res;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de l'ajout de la ville";
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Modifier une ville
    modifierVille: async (hashid, lib_ville) => {
        try {
            set({ loading: true, error: null });
            const res = await LocalisationService.modifierVille(hashid, lib_ville);
            if (res.success) {
                await get().fetchVilles();
                await get().fetchCommunes();
            }
            return res;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la modification de la ville";
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Supprimer une ville
    supprimerVille: async (hashid) => {
        try {
            set({ loading: true, error: null });
            const res = await LocalisationService.supprimerVille(hashid);
            if (res.success) {
                await get().fetchVilles();
                await get().fetchCommunes();
            }
            return res;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression de la ville";
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Ajouter une commune
    ajouterCommune: async (lib_commune, id_ville_hash) => {
        try {
            set({ loading: true, error: null });
            const res = await LocalisationService.ajouterCommune(lib_commune, id_ville_hash);
            if (res.success) {
                await get().fetchCommunes();
                const communesFiltrees = get().communes.filter(commune => 
                    commune.ville?.hashid === id_ville_hash
                );
                set((state) => ({
                    communesParVille: {
                        ...state.communesParVille,
                        [id_ville_hash]: communesFiltrees
                    }
                }));
            }
            return res;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de l'ajout de la commune";
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Modifier une commune
    modifierCommune: async (hashid, lib_commune, id_ville_hash) => {
        try {
            set({ loading: true, error: null });
            const res = await LocalisationService.modifierCommune(hashid, lib_commune, id_ville_hash);
            if (res.success) {
                await get().fetchCommunes();
                const communesFiltrees = get().communes.filter(commune => 
                    commune.ville?.hashid === id_ville_hash
                );
                set((state) => ({
                    communesParVille: {
                        ...state.communesParVille,
                        [id_ville_hash]: communesFiltrees
                    }
                }));
            }
            return res;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la modification de la commune";
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Supprimer une commune
    supprimerCommune: async (hashid) => {
        try {
            set({ loading: true, error: null });
            const res = await LocalisationService.supprimerCommune(hashid);
            if (res.success) {
                await get().fetchCommunes();
                const communesParVille = get().communes.reduce((acc, commune) => {
                    const villeId = commune.ville?.hashid;
                    if (villeId) {
                        if (!acc[villeId]) acc[villeId] = [];
                        acc[villeId].push(commune);
                    }
                    return acc;
                }, {});
                set({ communesParVille });
            }
            return res;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression de la commune";
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Récupérer les villes
    fetchVilles: async () => {
        try {
            set({ loading: true, error: null });
            const villes = await LocalisationService.getVilles();
            set({ villes });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement des villes";
            set({ error: errorMessage });
        } finally {
            set({ loading: false });
        }
    },

    // Récupérer toutes les communes
    fetchCommunes: async () => {
        try {
            set({ loading: true, error: null });
            const communes = await LocalisationService.getCommunes();
            const communesParVille = communes.reduce((acc, commune) => {
                const villeId = commune.ville?.hashid;
                if (villeId) {
                    if (!acc[villeId]) acc[villeId] = [];
                    acc[villeId].push(commune);
                }
                return acc;
            }, {});
            set({ communes, communesParVille });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement des communes";
            set({ error: errorMessage });
        } finally {
            set({ loading: false });
        }
    },

    // Récupérer les communes par ville
    fetchCommunesParVille: async (villeHashId) => {
        try {
            set({ loading: true, error: null });
            const result = await LocalisationService.getCommunesParVille(villeHashId);
            set((state) => ({
                communesParVille: {
                    ...state.communesParVille,
                    [villeHashId]: result.communes
                }
            }));
            return result.communes;
        } catch (error) {
            console.error("Erreur fetchCommunesParVille:", error);
            set((state) => ({
                communesParVille: {
                    ...state.communesParVille,
                    [villeHashId]: []
                }
            }));
            return [];
        } finally {
            set({ loading: false });
        }
    },

    // Effacer les erreurs
    clearError: () => set({ error: null }),

    // Méthode utilitaire pour récupérer les communes d'une ville
    getCommunesByVilleId: (villeHashId) => {
        const state = get();
        return state.communesParVille[villeHashId] || [];
    }
}));

export default useLocalisationStore;