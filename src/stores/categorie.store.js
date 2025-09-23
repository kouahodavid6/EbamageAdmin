import { create } from "zustand";
import toast from "react-hot-toast";
import CategorieService from "../services/categorie.service";

const useCategorieStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  selectedCategorie: null,

  addCategorie: async (categorieData) => {
    try {
      const res = await CategorieService.ajouterCategorie(categorieData);
      toast.success(res.message || "Catégorie ajoutée !");
      set((state) => ({
        categories: [...state.categories, res.data],
      }));
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'ajout.");
    }
  },

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await CategorieService.listerCategories();
      set({ categories: data });
    } catch (error) {
      toast.error(error.message || "Erreur lors du chargement des catégories.");
    } finally {
      set({ loading: false });
    }
  },

  getCategorie: async (hashid) => {
    try {
      const data = await CategorieService.obtenirCategorie(hashid);
      set({ selectedCategorie: data });
    } catch (error) {
      toast.error(error.message || "Catégorie introuvable.");
    }
  },

  updateCategorie: async (hashid, data) => {
    try {
      const res = await CategorieService.modifierCategorie(hashid, data);
      toast.success("Catégorie modifiée !");
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.hashid === hashid ? res : cat
        ),
      }));
    } catch (error) {
      toast.error(error.message || "Erreur lors de la modification.");
    }
  },

  deleteCategorie: async (hashid) => {
    try {
      await CategorieService.supprimerCategorie(hashid);
      toast.success("Catégorie supprimée !");
      set((state) => ({
        categories: state.categories.filter((cat) => cat.hashid !== hashid),
      }));
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression.");
    }
  },
}));

export default useCategorieStore;
