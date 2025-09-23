import axiosInstance from "../api/axiosInstance";

const getCommandes = async () => {
    try {
        const response = await axiosInstance.get("/api/commandes");
        return response.data;
    }catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        throw error.response?.data || error;
    }
}

export const commandeService = {
    getCommandes,
}