import { create } from "zustand";
import { commandeService } from "../services/commande.service";
import { toast } from 'react-hot-toast';

const useCommandeStore = create((set, get) => ({
    commandes: [],
    filteredCommandes: [],
    loading: false,
    error: null,
    filters: {
        statut: '',
        localisation: ''
    },

    fetchCommandes: async () => {
        set({ loading: true, error: null });
        try {
            const response = await commandeService.getCommandes();
            set({ 
                commandes: response.data || [], 
                filteredCommandes: response.data || [],
                loading: false 
            });
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error("Erreur lors du chargement des commandes");
        }
    },

    // Filtrer les commandes par ville/commune
    filtrerCommandes: async (recherche = '') => {
        set({ loading: true, error: null });
        try {
            const response = await commandeService.filtrerCommandes(recherche);
            set({ 
                filteredCommandes: response.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error("Erreur lors du filtrage des commandes");
            throw error;
        }
    },

    // Appliquer les filtres locaux (statut et localisation)
    appliquerFiltres: (filters) => {
        set({ filters });
        const { commandes } = get();
        
        let filtered = [...commandes];

        // Filtre par statut
        if (filters.statut) {
            filtered = filtered.filter(commande => 
                commande.statut === filters.statut
            );
        }

        // Filtre par localisation (ville ou commune)
        if (filters.localisation) {
            const searchTerm = filters.localisation.toLowerCase();
            filtered = filtered.filter(commande => 
                commande.localisation.ville.toLowerCase().includes(searchTerm) ||
                commande.localisation.commune.toLowerCase().includes(searchTerm)
            );
        }

        set({ filteredCommandes: filtered });
    },

    // Réinitialiser les filtres
    reinitialiserFiltres: () => {
        const { commandes } = get();
        set({ 
            filters: { statut: '', localisation: '' },
            filteredCommandes: commandes 
        });
    },

    // Annuler une commande
    annulerCommande: async (hashid, onSuccess) => {
        try {
            const response = await commandeService.annulerCommande(hashid);
            
            // Mettre à jour la commande dans les listes
            set(state => ({
                commandes: state.commandes.map(commande =>
                    commande.hashid === hashid 
                        ? { ...commande, statut: 'Annulée', articles: response.data.articles }
                        : commande
                ),
                filteredCommandes: state.filteredCommandes.map(commande =>
                    commande.hashid === hashid 
                        ? { ...commande, statut: 'Annulée', articles: response.data.articles }
                        : commande
                )
            }));
            
            toast.success(response.message || "Commande annulée avec succès");
            if (onSuccess) onSuccess();
            return response;
        } catch (error) {
            toast.error(error.message || "Erreur lors de l'annulation de la commande");
            throw error;
        }
    },

    // Livrer une commande
    livrerCommande: async (hashid, onSuccess) => {
        try {
            const response = await commandeService.livrerCommande(hashid);
            
            set(state => ({
                commandes: state.commandes.map(commande =>
                    commande.hashid === hashid 
                        ? { ...commande, statut: 'Livrée', articles: response.data.articles }
                        : commande
                ),
                filteredCommandes: state.filteredCommandes.map(commande =>
                    commande.hashid === hashid 
                        ? { ...commande, statut: 'Livrée', articles: response.data.articles }
                        : commande
                )
            }));
            
            toast.success(response.message || "Commande livrée avec succès");
            if (onSuccess) onSuccess();
            return response;
        } catch (error) {
            toast.error(error.message || "Erreur lors de la livraison de la commande");
            throw error;
        }
    },

    // Confirmer une commande
    confirmerCommande: async (hashid, onSuccess) => {
        try {
            const response = await commandeService.confirmerCommande(hashid);
            
            set(state => ({
                commandes: state.commandes.map(commande =>
                    commande.hashid === hashid 
                        ? { ...commande, statut: 'Confirmée', articles: response.data.articles }
                        : commande
                ),
                filteredCommandes: state.filteredCommandes.map(commande =>
                    commande.hashid === hashid 
                        ? { ...commande, statut: 'Confirmée', articles: response.data.articles }
                        : commande
                )
            }));
            
            toast.success(response.message || "Commande confirmée avec succès");
            if (onSuccess) onSuccess();
            return response;
        } catch (error) {
            toast.error(error.message || "Erreur lors de la confirmation de la commande");
            throw error;
        }
    },

    // Changer statut d'une sous-commande
    changerStatutSousCommande: async (hashidCommande, hashidArticle, statut, libVariation = null, onSuccess) => {
        try {
            const response = await commandeService.changerStatutSousCommande(
                hashidCommande, 
                hashidArticle, 
                statut, 
                libVariation
            );
            
            // Mettre à jour les articles de la commande dans les listes
            set(state => ({
                commandes: state.commandes.map(commande =>
                    commande.hashid === hashidCommande 
                        ? { ...commande, articles: response.articles }
                        : commande
                ),
                filteredCommandes: state.filteredCommandes.map(commande =>
                    commande.hashid === hashidCommande 
                        ? { ...commande, articles: response.articles }
                        : commande
                )
            }));

            // Vérifier si toutes les sous-commandes sont confirmées
            const commande = get().commandes.find(c => c.hashid === hashidCommande);
            if (commande && statut === 'Confirmée') {
                const toutesConfirmees = commande.articles.every(article => 
                    article.statut_sous_commande === 'Confirmée'
                );
                
                if (toutesConfirmees) {
                    // Auto-confirmer la commande principale
                    get().confirmerCommande(hashidCommande, onSuccess);
                    return; // Ne pas afficher le toast deux fois
                }
            }

            toast.success(response.message || "Statut de la sous-commande mis à jour");
            if (onSuccess) onSuccess();
            return response;
        } catch (error) {
            toast.error(error.message || "Erreur lors du changement de statut");
            throw error;
        }
    },

    clearError: () => set({ error: null })
}));

export default useCommandeStore;