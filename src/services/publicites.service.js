// src/services/publicites.service.js
import axiosInstance from "../api/axiosInstance";

// Envoyer une publicité aux clients
const sendToClients = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/publicite/ajout/clients", formData,
            { 
                timeout: 30000,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        const msg =
            error.response?.data?.errors?.image?.[0] ||
            error.response?.data?.errors?.images?.[0] ||
            error.response?.data?.message ||
            "Erreur inconnue lors de l'envoi de la publicité.";

        throw new Error(msg);
    }
}

// Récupérer toutes les publicités clients
const getPublicitesClients = async () => {
    try {
        const response = await axiosInstance.get("/api/publicite/clients");
        return response.data;
    } catch (error) {
        const msg =
            error.response?.data?.message ||
            "Erreur lors de la récupération des publicités.";
        throw new Error(msg);
    }
}

// Modifier une publicité
const updatePublicite = async (hashid, formData) => {
    try {
        const response = await axiosInstance.post(`/api/publicite/modif/${hashid}`, formData,
            { 
                timeout: 30000,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        const msg =
            error.response?.data?.errors?.image?.[0] ||
            error.response?.data?.errors?.images?.[0] ||
            error.response?.data?.message ||
            "Erreur inconnue lors de l'envoi de la publicité.";

        throw new Error(msg);
    }
}

// Supprimer une publicité
const deletePublicite = async (hashid) => {
    try {
        const response = await axiosInstance.delete(`/api/publicite/supprimer/${hashid}`);
        return response.data;
    } catch (error) {
        const msg =
            error.response?.data?.message ||
            "Erreur lors de la suppression de la publicité.";
        throw new Error(msg);
    }
}

export const publicitesService = {
    sendToClients,
    getPublicitesClients,
    updatePublicite,
    deletePublicite
}