import axiosInstance from "../api/axiosInstance";

const getArticlesByBoutique = async (boutiqueHashid) => {
    try {
        const response = await axiosInstance.get(`/api/articles/boutique/${boutiqueHashid}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const boutiqueArticleService = {
    getArticlesByBoutique
};