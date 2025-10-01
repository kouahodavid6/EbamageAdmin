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

const deleteBoutiques = async (hashid) => {
    try{
        const response = await axiosInstance.post(`/api/boutique/delete/${hashid}`);
        return response.data;
    }catch(error) {
        console.error("Erreur lors de la suppresion de la boutique: ", error);
        throw error.response?.data || error;
    }
}

export const boutiqueService = {
    getBoutiques,
    deleteBoutiques
};