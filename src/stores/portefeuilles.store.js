// stores/portefeuilleStore.js
import { create } from 'zustand';
import { portefeuillesService } from '../services/portefeuilles.service';

export const usePortefeuilleStore = create((set, get) => ({
  // États
  soldeAdmin: null,
  portefeuilles: {
    boutiques: [],
    livreurs: []
  },
  loading: false,
  error: null,
  success: null,

  // Actions
  // Récupérer le solde admin
  async fetchSoldeAdmin() {
    set({ loading: true, error: null });
    try {
      const response = await portefeuillesService.getSoldeAdmin();
      set({ 
        soldeAdmin: response.data,
        loading: false,
        success: 'Solde admin récupéré avec succès'
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

  // Récupérer les portefeuilles
  async fetchPortefeuilles() {
    set({ loading: true, error: null });
    try {
      const response = await portefeuillesService.getPortefeuilles();
      set({ 
        portefeuilles: response.data,
        loading: false,
        success: 'Portefeuilles récupérés avec succès'
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
  async marquerCommePaye(hashid, type) {
    set({ loading: true, error: null });
    try {
      const response = await portefeuillesService.marquerPaye(hashid);
      
      // Mettre à jour l'état local
      const { portefeuilles } = get();
      const updatedPortefeuilles = { ...portefeuilles };
      
      if (type === 'boutique') {
        updatedPortefeuilles.boutiques = portefeuilles.boutiques.map(boutique =>
          boutique.hashid === hashid ? { ...boutique, statut_paiement: 'payé' } : boutique
        );
      } else if (type === 'livreur') {
        updatedPortefeuilles.livreurs = portefeuilles.livreurs.map(livreur =>
          livreur.hashid === hashid ? { ...livreur, statut_paiement: 'payé' } : livreur
        );
      }
      
      set({ 
        portefeuilles: updatedPortefeuilles,
        loading: false,
        success: 'Portefeuille marqué comme payé avec succès'
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

  // Calculer les totaux
  getTotals() {
    const { portefeuilles } = get();
    
    const totalBoutiques = portefeuilles.boutiques.reduce((sum, boutique) => 
      sum + (parseFloat(boutique.solde_a_payer) || 0), 0
    );
    
    const totalLivreurs = portefeuilles.livreurs.reduce((sum, livreur) => 
      sum + (parseFloat(livreur.solde_a_payer) || 0), 0
    );
    
    const totalAPayer = totalBoutiques + totalLivreurs;
    const totalPaye = portefeuilles.boutiques
      .concat(portefeuilles.livreurs)
      .reduce((sum, item) => 
        item.statut_paiement === 'payé' ? sum + (parseFloat(item.solde_a_payer) || 0) : sum, 0
      );

    return {
      totalBoutiques,
      totalLivreurs,
      totalAPayer,
      totalPaye
    };
  },

  // Filtrer les portefeuilles
  getFilteredPortefeuilles(searchTerm = '', type = 'tous') {
    const { portefeuilles } = get();
    
    let filteredBoutiques = portefeuilles.boutiques;
    let filteredLivreurs = portefeuilles.livreurs;

    // Filtre par type
    if (type !== 'tous') {
      if (type === 'boutiques') {
        filteredLivreurs = [];
      } else if (type === 'livreurs') {
        filteredBoutiques = [];
      }
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredBoutiques = filteredBoutiques.filter(boutique =>
        boutique.nom?.toLowerCase().includes(term) ||
        boutique.email?.toLowerCase().includes(term)
      );
      filteredLivreurs = filteredLivreurs.filter(livreur =>
        livreur.nom?.toLowerCase().includes(term) ||
        livreur.prenom?.toLowerCase().includes(term) ||
        livreur.email?.toLowerCase().includes(term)
      );
    }

    return {
      boutiques: filteredBoutiques,
      livreurs: filteredLivreurs
    };
  },

  // Clear messages
  clearMessages() {
    set({ error: null, success: null });
  }
}));