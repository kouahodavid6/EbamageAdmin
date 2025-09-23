import axiosInstance from "../api/axiosInstance";

const getBoutiques = async () => {
    try {
        const response = await axiosInstance.get("/api/boutiques");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des boutiques:", error);
        throw error.response?.data || error;
    }
}

export const boutiqueService = {
    getBoutiques
};