import axiosInstance from "../api/axiosInstance";

const getArticlesByBoutique = async (boutiqueHashid) => {
    try {
        const response = await axiosInstance.get(`/api/articles/boutique/${boutiqueHashid}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des articles de la boutique:", error);
        throw error.response?.data || error;
    }
}

export const boutiqueArticleService = {
    getArticlesByBoutique
};