import axiosInstance from "../api/axiosInstance";

const getCommandes = async () => {
    try {
        const response = await axiosInstance.get("/api/commandes");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        throw error.response?.data || error;
    }
}

// Filtrer les commandes par ville/commune
const filtrerCommandes = async (recherche = '') => {
    try {
        const response = await axiosInstance.get(`/api/commandes/filtre?recherche=${encodeURIComponent(recherche)}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors du filtrage des commandes:", error);
        throw error.response?.data || error;
    }
}

// Changer statut commande en "Annulée"
const annulerCommande = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/commande/${hashid}/annule`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'annulation de la commande:", error);
        throw error.response?.data || error;
    }
}

// Changer statut commande en "Livrée"
const livrerCommande = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/commande/${hashid}/livree`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la livraison de la commande:", error);
        throw error.response?.data || error;
    }
}

// Changer statut commande en "Confirmée"
const confirmerCommande = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/commande/${hashid}/confirme`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la confirmation de la commande:", error);
        throw error.response?.data || error;
    }
}

// Changer statut d'une sous-commande
const changerStatutSousCommande = async (hashidCommande, hashidArticle, statut, libVariation = null) => {
    try {
        const data = { statut };
        if (libVariation) {
            data.lib_variation = libVariation;
        }
        
        const response = await axiosInstance.post(
            `/api/commande/${hashidCommande}/sous_commande/${hashidArticle}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement de statut de la sous-commande:", error);
        throw error.response?.data || error;
    }
}

export const commandeService = {
    getCommandes,
    filtrerCommandes,
    annulerCommande,
    livrerCommande,
    confirmerCommande,
    changerStatutSousCommande
}