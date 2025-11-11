import { create } from 'zustand';
import { portefeuillesService } from '../services/portefeuilles.service';

export const usePortefeuilleStore = create((set, get) => ({
  // États
  soldes: {
    solde_admin: 0,
    solde_boutique: 0,
    solde_livreur: 0
  },
  reclamations: [],
  loading: false,
  error: null,
  success: null,

  // Actions
  // Récupérer les soldes
  async fetchSoldes() {
    set({ loading: true, error: null });
    try {
      const response = await portefeuillesService.getSoldes();
      
      set({ 
        soldes: response.data?.data || response.data || {
          solde_admin: 0,
          solde_boutique: 0,
          solde_livreur: 0
        },
        loading: false,
        success: 'Soldes récupérés avec succès'
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

  // Récupérer les réclamations
  async fetchReclamations() {
    set({ loading: true, error: null });
    try {
      const response = await portefeuillesService.getReclamations();
      
      // Accéder aux données selon la structure exacte de votre API
      const reclamationsData = response.data?.data || [];
      
      set({ 
        reclamations: Array.isArray(reclamationsData) ? reclamationsData : [],
        loading: false,
        success: 'Réclamations récupérées avec succès'
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

  // Marquer comme payé
  async marquerCommePaye(hashid) {
    set({ loading: true, error: null });
    try {
      const response = await portefeuillesService.marquerPaye(hashid);
      
      // Mettre à jour l'état local avec les données de l'API
      const { reclamations } = get();
      const updatedReclamations = reclamations.map(reclamation =>
        reclamation.hashid === hashid 
          ? { 
              ...reclamation, 
              is_paid: true,
              statut: "Payé"
            } 
          : reclamation
      );
      
      set({ 
        reclamations: updatedReclamations,
        loading: false,
        success: response.data?.message || 'Réclamation marquée comme payée avec succès'
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

  // Calculer les totaux BASÉS SUR LES VRAIES DONNÉES DE L'API
  getTotals() {
    const { reclamations } = get();
    
    // Filtrer seulement les réclamations en attente (is_paid = false)
    const reclamationsEnAttente = reclamations.filter(r => r.is_paid === false);
    
    const totalBoutiques = reclamationsEnAttente
      .reduce((sum, reclamation) => sum + (parseFloat(reclamation.montant) || 0), 0);
    
    return {
      totalBoutiques,
      totalReclamations: reclamationsEnAttente.length
    };
  },

  // Filtrer les réclamations avec recherche par nom de boutique
  getFilteredReclamations(searchTerm = '', statut = 'statut_tous') {
    const { reclamations } = get();
    
    let filtered = [...reclamations];

    // Filtre par recherche (nom_boutique ou code_commande)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reclamation =>
        reclamation.nom_boutique?.toLowerCase().includes(term) ||
        reclamation.code_commande?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut (is_paid)
    if (statut !== 'statut_tous') {
      filtered = filtered.filter(reclamation =>
        statut === 'payé' 
          ? reclamation.is_paid === true 
          : reclamation.is_paid === false
      );
    }

    return filtered;
  },

  // Récupérer seulement les réclamations en attente
  getReclamationsEnAttente() {
    const { reclamations } = get();
    return reclamations.filter(r => r.is_paid === false);
  },

  // Clear messages
  clearMessages() {
    set({ error: null, success: null });
  }
}));