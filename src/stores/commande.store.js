// src/stores/commande.store.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { commandeService } from "../services/commande.service";
import { toast } from "react-hot-toast";

// Calcul du statut global d'une commande à partir de ses sous-commandes
const computeCommandeStatutFromArticles = (articles = []) => {
  if (!Array.isArray(articles) || articles.length === 0) return "En attente";

  const allLivree = articles.every(a => a?.statut_sous_commande === "Livrée");
  const allConfirme = articles.every(a => a?.statut_sous_commande === "Confirmée");

  if (allLivree) return "Livrée";
  if (allConfirme) return "Confirmée";
  return "En attente";
};

const initialState = {
  commandes: [],
  filteredCommandes: [],
  loading: false,
  error: null,
  filters: { statut: "", localisation: "" },
  toastMessage: null
};

const useCommandeStore = create(persist((set, get) => ({
  ...initialState,

  _setLoading: (v) => set({ loading: v }),
  _setError: (err) => set({ error: err }),

  _updateCommandeInLists: (hashid, patch) => {
    set(state => ({
      commandes: state.commandes.map(c => c?.hashid === hashid ? { ...c, ...patch } : c),
      filteredCommandes: state.filteredCommandes.map(c => c?.hashid === hashid ? { ...c, ...patch } : c)
    }));
  },

  clearToast: () => set({ toastMessage: null }),

  fetchCommandes: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await commandeService.getCommandes();
      const data = resp?.data ?? resp;
      const commandes = Array.isArray(data) ? data : (data?.commandes ?? []);
      set({ commandes, filteredCommandes: commandes, loading: false });
      return commandes;
    } catch (error) {
      set({ error: error?.message ?? "Erreur", loading: false });
      toast.error("Erreur lors du chargement des commandes");
      throw error;
    }
  },

  appliquerFiltres: (filters) => {
    set({ filters });
    const { commandes } = get();
    let filtered = Array.isArray(commandes) ? [...commandes] : [];

    if (filters?.statut) {
      filtered = filtered.filter(commande => commande?.statut === filters.statut);
    }

    if (filters?.localisation) {
      const searchTerm = filters.localisation.toLowerCase();
      filtered = filtered.filter(commande => {
        const ville = commande?.localisation?.ville ?? "";
        const commune = commande?.localisation?.commune ?? "";
        return ville.toLowerCase().includes(searchTerm) || commune.toLowerCase().includes(searchTerm);
      });
    }

    set({ filteredCommandes: filtered });
  },

  reinitialiserFiltres: () => {
    const { commandes } = get();
    set({ filters: { statut: "", localisation: "" }, filteredCommandes: commandes ?? [] });
  },

  // --- ACTIONS SUR LA COMMANDE PRINCIPALE ---

  confirmerCommande: async (hashid, onSuccess) => {
    set({ loading: true, error: null });
    try {
      const resp = await commandeService.confirmerCommande(hashid);
      const data = resp?.data ?? resp;
      const articles = data?.articles ?? null;
      const message = data?.message ?? "Commande confirmée";

      if (Array.isArray(articles)) {
        const statut = computeCommandeStatutFromArticles(articles);
        get()._updateCommandeInLists(hashid, { statut, articles });
      } else {
        const commande = get().commandes.find(c => c.hashid === hashid);
        if (commande) {
          const newArticles = (commande.articles ?? []).map(a => ({ ...a, statut_sous_commande: "Confirmée" }));
          get()._updateCommandeInLists(hashid, { statut: "Confirmée", articles: newArticles });
        }
      }

      toast.success(message);
      set({ toastMessage: message, loading: false });
      if (onSuccess) onSuccess();
      return resp;
    } catch (error) {
      set({ loading: false });
      const errMsg = error?.message ?? "Erreur lors de la confirmation";
      toast.error(errMsg);
      throw error;
    }
  },

  livrerCommande: async (hashid, onSuccess) => {
    set({ loading: true, error: null });
    try {
      const commande = get().commandes.find(c => c.hashid === hashid);
      const currentStatut = commande?.statut ?? computeCommandeStatutFromArticles(commande?.articles);

      if (currentStatut !== "Confirmée") {
        const err = "La commande doit être confirmée avant d'être livrée.";
        toast.error(err);
        set({ loading: false });
        throw new Error(err);
      }

      const resp = await commandeService.livrerCommande(hashid);
      const data = resp?.data ?? resp;
      const articles = data?.articles ?? null;
      const message = data?.message ?? "Commande livrée";

      if (Array.isArray(articles)) {
        const statut = computeCommandeStatutFromArticles(articles);
        get()._updateCommandeInLists(hashid, { statut, articles });
      } else {
        const commandeLocal = get().commandes.find(c => c.hashid === hashid);
        if (commandeLocal) {
          const newArticles = (commandeLocal.articles ?? []).map(a => ({ ...a, statut_sous_commande: "Livrée" }));
          get()._updateCommandeInLists(hashid, { statut: "Livrée", articles: newArticles });
        }
      }

      toast.success(message);
      set({ toastMessage: message, loading: false });
      if (onSuccess) onSuccess();
      return resp;
    } catch (error) {
      set({ loading: false });
      const errMsg = error?.message ?? "Erreur lors de la livraison";
      toast.error(errMsg);
      throw error;
    }
  },

  // --- ACTION SUR UNE SOUS-COMMANDE ---
  changerStatutSousCommande: async (hashidCommande, hashidArticle, statut, onSuccess) => {
    set({ loading: true, error: null });
    try {
      const commande = get().commandes.find(c => c.hashid === hashidCommande);
      const article = commande?.articles?.find(a => a.hashid === hashidArticle);
      const current = article?.statut_sous_commande ?? "En attente";

      if (statut === "Livrée" && current !== "Confirmée") {
        const err = "Une sous-commande doit être confirmée avant d'être livrée.";
        toast.error(err);
        set({ loading: false });
        throw new Error(err);
      }

      const resp = await commandeService.changerStatutSousCommande(hashidCommande, hashidArticle, statut);
      const data = resp?.data ?? resp;
      const returnedArticles = data?.articles ?? commande?.articles ?? [];
      const newStatutCommande = computeCommandeStatutFromArticles(returnedArticles);

      // Si la commande principale est Livrée, bloquer toute modification
      if (commande?.statut === "Livrée") {
        toast.error("La commande principale est déjà livrée. Aucune modification possible.");
        set({ loading: false });
        throw new Error("Commande principale Livrée");
      }

      get()._updateCommandeInLists(hashidCommande, { articles: returnedArticles, statut: newStatutCommande });

      toast.success(data?.message ?? "Statut mis à jour");
      set({ toastMessage: data?.message ?? "Statut mis à jour", loading: false });
      if (onSuccess) onSuccess();
      return resp;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })

}),
{
  name: "commande-store-v2",
  partialize: (state) => ({
    commandes: state.commandes,
    filteredCommandes: state.filteredCommandes,
    filters: state.filters
  }),
  version: 2
}));

export default useCommandeStore;
