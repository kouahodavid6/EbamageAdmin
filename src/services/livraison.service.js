// services/livraison.service.js
import axiosInstance from "../api/axiosInstance";

const afficherPrix = async () => {
    try {
        const response = await axiosInstance.get("/api/afficher/prix");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement du prix de la livraison");
    }
}

const modifierPrix = async (nouveauPrix) => {
    try {
        const response = await axiosInstance.post('/api/update/prix', { prix: nouveauPrix });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification du prix de la livraison");
    }
}

const afficherSeuil = async () => {
    try {
        const response = await axiosInstance.get("/api/afficher/seuil");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement du seuil de livraison");
    }
}

const modifierSeuil = async (nouveauSeuil) => {
    try {
        const response = await axiosInstance.post('/api/update/seuil', { seuil: nouveauSeuil });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification du seuil pour la livraison gratuite");
    }
}

export const livraisonService = {
    afficherPrix,
    modifierPrix,
    afficherSeuil,
    modifierSeuil
}